#!/usr/bin/env node
/**
 * verify-sql-seed-row-counts.js
 *
 * Parses each asset seed SQL chunk and reports any VALUES tuple that has a
 * different number of top-level comma-separated values from the INSERT column list.
 *
 * Handles: single-quoted strings (including '' escapes), ::type casts,
 *          multi-line tuples, nested parentheses (e.g. jsonb literals).
 */

const fs   = require('fs');
const path = require('path');

const CHUNKS_DIR = path.join(__dirname, '../supabase/mobile_chunks');
const FILES = [
  '103a_seed_team_stock_assets.sql',
  '103b_seed_player_coin_assets_teams_1_to_8.sql',
  '103c_seed_player_coin_assets_teams_9_to_16.sql',
  '103d_seed_player_coin_assets_teams_17_to_24.sql',
  '103e_seed_player_coin_assets_teams_25_to_32.sql',
  '103f_seed_coach_index_future_meme_assets.sql',
];

/** Count top-level commas inside an already-stripped SQL tuple body (no outer parens). */
function countValues(inner) {
  let count = 1;
  let depth = 0;
  let inStr = false;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    const nx = inner[i + 1];
    if (inStr) {
      if (ch === "'" && nx === "'") { i++; continue; }  // '' escape
      if (ch === "'") inStr = false;
      continue;
    }
    if (ch === "'") { inStr = true; continue; }
    if (ch === '(') { depth++; continue; }
    if (ch === ')') { depth--; continue; }
    if (ch === ',' && depth === 0) count++;
  }
  return count;
}

/** Count top-level commas in a column-list string (no outer parens). */
function countColumns(colInner) {
  // Column list has no strings or nested parens normally, but be safe
  return countValues(colInner);
}

let allPassed = true;

for (const fname of FILES) {
  const fpath = path.join(CHUNKS_DIR, fname);
  const src   = fs.readFileSync(fpath, 'utf8');
  const lines = src.split('\n');

  console.log(`\n=== ${fname} ===`);
  let fileOk = true;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*insert\s+into\s+public\.assets/i.test(line)) {
      const insertStartLine = i + 1; // 1-indexed for display

      // ── 1. Collect the column list (find opening paren on same or next line)
      let j = i;
      while (j < lines.length && !lines[j].includes('(')) j++;

      let colText = '';
      let depth = 0;
      let started = false;
      colScan:
      while (j < lines.length) {
        for (const ch of lines[j]) {
          if (ch === '(' && !started) { started = true; depth = 1; continue; }
          if (!started) continue;
          if (ch === '(') { depth++; colText += ch; }
          else if (ch === ')') {
            depth--;
            if (depth === 0) break colScan;
            colText += ch;
          } else {
            colText += ch;
          }
        }
        j++;
      }
      const colCount = countColumns(colText.trim());

      // ── 2. Find VALUES keyword
      let k = j;
      while (k < lines.length && !/^\s*values\s*$/i.test(lines[k].trim())) k++;
      k++; // move past 'values'

      // ── 3. Walk each tuple
      let tupleNum = 0;
      while (k < lines.length) {
        const trimmed = lines[k].trim();
        if (/^on\s+conflict/i.test(trimmed)) { k++; break; }
        if (!trimmed.startsWith('(')) { k++; continue; }

        tupleNum++;
        const tupleStartLine = k + 1; // 1-indexed

        // Collect the complete tuple text (handles multi-line)
        let tupleText = '';
        let inStr2 = false;
        let depth2 = 0;
        let doneCollect = false;

        collectLoop:
        while (k < lines.length) {
          const l = lines[k];
          for (let ci = 0; ci < l.length; ci++) {
            const ch  = l[ci];
            const nx  = l[ci + 1];

            if (inStr2) {
              if (ch === "'" && nx === "'") { tupleText += ch + "'"; ci++; continue; }
              if (ch === "'") { inStr2 = false; tupleText += ch; continue; }
              tupleText += ch;
              continue;
            }

            if (ch === "'") { inStr2 = true; tupleText += ch; continue; }
            if (ch === '(') {
              depth2++;
              tupleText += ch;
              continue;
            }
            if (ch === ')') {
              depth2--;
              tupleText += ch;
              if (depth2 === 0) { doneCollect = true; break collectLoop; }
              continue;
            }
            tupleText += ch;
          }
          k++;
          if (!doneCollect) tupleText += '\n';
        }

        // Strip the outer ( ) — tupleText starts exactly with '(' now
        // because we only start adding once we hit the first '('
        // Actually tupleText may have chars before the first '(' (leading spaces on first line).
        // Find the actual first '(' and last ')'.
        const firstParen = tupleText.indexOf('(');
        const lastParen  = tupleText.lastIndexOf(')');
        const inner = tupleText.slice(firstParen + 1, lastParen);

        const valCount = countValues(inner);

        if (valCount !== colCount) {
          console.log(`  ❌ INSERT at line ${insertStartLine}: tuple #${tupleNum} (file line ${tupleStartLine}) → ${valCount} values, expected ${colCount}`);
          fileOk = false;
          allPassed = false;
        }
      }

      console.log(`  INSERT at line ${insertStartLine}: ${tupleNum} tuples, ${colCount} cols — ${fileOk ? 'OK so far' : 'HAS ERRORS'}`);
      i = k;
    } else {
      i++;
    }
  }

  if (fileOk) console.log(`  ✅ All tuples valid`);
}

console.log('\n' + (allPassed ? '✅ ALL FILES CLEAN' : '❌ FAILURES FOUND — see above'));
