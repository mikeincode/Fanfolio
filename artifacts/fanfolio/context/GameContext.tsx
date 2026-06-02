import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@fanfolio_game_state";
const INITIAL_BALANCE = 10000;
const DAILY_CLAIM_AMOUNT = 1000;

export interface Holding {
  assetId: string;
  quantity: number;
  averageCost: number;
  totalInvested: number;
}

export interface Transaction {
  id: string;
  assetId: string;
  assetName: string;
  assetSymbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  total: number;
  timestamp: number;
}

interface GameState {
  luckyCoinBalance: number;
  holdings: Holding[];
  transactions: Transaction[];
  hasCompletedOnboarding: boolean;
  lastDailyClaim: string | null;
  username: string;
  joinDate: number;
}

interface GameContextValue extends GameState {
  buyAsset: (assetId: string, assetName: string, assetSymbol: string, price: number, quantity: number) => { success: boolean; message: string };
  sellAsset: (assetId: string, assetName: string, assetSymbol: string, price: number, quantity: number) => { success: boolean; message: string };
  claimDaily: () => { success: boolean; message: string };
  completeOnboarding: (username: string) => void;
  getHolding: (assetId: string) => Holding | undefined;
  portfolioValue: number;
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  canClaimDaily: boolean;
  updateUsername: (username: string) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const defaultState: GameState = {
  luckyCoinBalance: INITIAL_BALANCE,
  holdings: [],
  transactions: [],
  hasCompletedOnboarding: false,
  lastDailyClaim: null,
  username: "TraderFan",
  joinDate: Date.now(),
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as GameState;
          setState(parsed);
        } catch {
          setState(defaultState);
        }
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback((newState: GameState) => {
    setState(newState);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const buyAsset = useCallback((
    assetId: string,
    assetName: string,
    assetSymbol: string,
    price: number,
    quantity: number
  ): { success: boolean; message: string } => {
    const total = price * quantity;
    if (state.luckyCoinBalance < total) {
      return { success: false, message: "Not enough LuckyCoin" };
    }

    const existingIdx = state.holdings.findIndex(h => h.assetId === assetId);
    const newHoldings = [...state.holdings];

    if (existingIdx >= 0) {
      const existing = newHoldings[existingIdx];
      const newQty = existing.quantity + quantity;
      const newInvested = existing.totalInvested + total;
      newHoldings[existingIdx] = {
        ...existing,
        quantity: newQty,
        totalInvested: newInvested,
        averageCost: newInvested / newQty,
      };
    } else {
      newHoldings.push({
        assetId,
        quantity,
        averageCost: price,
        totalInvested: total,
      });
    }

    const tx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      assetId,
      assetName,
      assetSymbol,
      type: "buy",
      quantity,
      price,
      total,
      timestamp: Date.now(),
    };

    save({
      ...state,
      luckyCoinBalance: state.luckyCoinBalance - total,
      holdings: newHoldings,
      transactions: [tx, ...state.transactions],
    });

    return { success: true, message: `Bought ${quantity} ${assetSymbol} for ${total.toLocaleString()} LC` };
  }, [state, save]);

  const sellAsset = useCallback((
    assetId: string,
    assetName: string,
    assetSymbol: string,
    price: number,
    quantity: number
  ): { success: boolean; message: string } => {
    const existingIdx = state.holdings.findIndex(h => h.assetId === assetId);
    if (existingIdx < 0) {
      return { success: false, message: "You do not own this asset" };
    }

    const existing = state.holdings[existingIdx];
    if (existing.quantity < quantity) {
      return { success: false, message: "Not enough shares to sell" };
    }

    const total = price * quantity;
    const newHoldings = [...state.holdings];

    if (existing.quantity === quantity) {
      newHoldings.splice(existingIdx, 1);
    } else {
      const newQty = existing.quantity - quantity;
      const portionSold = quantity / existing.quantity;
      const remainingInvested = existing.totalInvested * (1 - portionSold);
      newHoldings[existingIdx] = {
        ...existing,
        quantity: newQty,
        totalInvested: remainingInvested,
        averageCost: remainingInvested / newQty,
      };
    }

    const tx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      assetId,
      assetName,
      assetSymbol,
      type: "sell",
      quantity,
      price,
      total,
      timestamp: Date.now(),
    };

    save({
      ...state,
      luckyCoinBalance: state.luckyCoinBalance + total,
      holdings: newHoldings,
      transactions: [tx, ...state.transactions],
    });

    return { success: true, message: `Sold ${quantity} ${assetSymbol} for ${total.toLocaleString()} LC` };
  }, [state, save]);

  const claimDaily = useCallback((): { success: boolean; message: string } => {
    const today = new Date().toDateString();
    if (state.lastDailyClaim === today) {
      return { success: false, message: "Already claimed today. Come back tomorrow!" };
    }
    save({
      ...state,
      luckyCoinBalance: state.luckyCoinBalance + DAILY_CLAIM_AMOUNT,
      lastDailyClaim: today,
    });
    return { success: true, message: `+${DAILY_CLAIM_AMOUNT.toLocaleString()} LuckyCoin claimed!` };
  }, [state, save]);

  const completeOnboarding = useCallback((username: string) => {
    save({ ...state, hasCompletedOnboarding: true, username, joinDate: Date.now() });
  }, [state, save]);

  const updateUsername = useCallback((username: string) => {
    save({ ...state, username });
  }, [state, save]);

  const getHolding = useCallback((assetId: string): Holding | undefined => {
    return state.holdings.find(h => h.assetId === assetId);
  }, [state.holdings]);

  const canClaimDaily = state.lastDailyClaim !== new Date().toDateString();

  if (!loaded) return null;

  return (
    <GameContext.Provider value={{
      ...state,
      buyAsset,
      sellAsset,
      claimDaily,
      completeOnboarding,
      getHolding,
      canClaimDaily,
      portfolioValue: 0,
      totalValue: state.luckyCoinBalance,
      totalInvested: 0,
      totalProfitLoss: 0,
      totalProfitLossPercent: 0,
      updateUsername,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

export function usePortfolioStats(currentPrices: Record<string, number>) {
  const { holdings, luckyCoinBalance, totalInvested: _ti } = useGame();

  const portfolioValue = holdings.reduce((sum, h) => {
    const price = currentPrices[h.assetId] ?? h.averageCost;
    return sum + price * h.quantity;
  }, 0);

  const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);
  const totalValue = portfolioValue + luckyCoinBalance;
  const totalProfitLoss = portfolioValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return { portfolioValue, totalValue, totalInvested, totalProfitLoss, totalProfitLossPercent };
}
