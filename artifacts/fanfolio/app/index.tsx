import { Redirect } from "expo-router";
import { useGame } from "@/context/GameContext";

export default function RootIndex() {
  const { hasCompletedOnboarding } = useGame();
  return <Redirect href={hasCompletedOnboarding ? "/(tabs)" : "/onboarding"} />;
}
