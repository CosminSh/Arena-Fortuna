import { spinReels, evaluateCombination } from '../src/engine/mathEngine';

console.log('====================================================');
console.log('  ARENA FORTUNA — COMBAT SYMBOL PROBABILITY SIMULATOR');
console.log('====================================================\n');

const TOTAL_SPINS = 100_000;
let jackpotCount = 0;
let commonCount = 0;
let fumbleCount = 0;

console.log(`Running Monte Carlo simulation of ${TOTAL_SPINS.toLocaleString()} 3-reel spins...\n`);

const startTime = Date.now();

for (let i = 0; i < TOTAL_SPINS; i++) {
  const reels = spinReels();
  const res = evaluateCombination(reels);

  if (res.tier === 'jackpot') jackpotCount++;
  else if (res.tier === 'common') commonCount++;
  else fumbleCount++;
}

const elapsed = Date.now() - startTime;

const jackpotObserved = (jackpotCount / TOTAL_SPINS) * 100;
const commonObserved = (commonCount / TOTAL_SPINS) * 100;
const fumbleObserved = (fumbleCount / TOTAL_SPINS) * 100;

console.log('RESULTS & COMPARISON (Observed vs Theoretical):');
console.log('-----------------------------------------------------------------------------');
console.log(`Outcome Tier      | Count    | Observed % | Theoretical % | Margin of Error`);
console.log('-----------------------------------------------------------------------------');
console.log(`3-of-a-Kind (Jackpot) | ${jackpotCount.toString().padStart(8)} | ${jackpotObserved.toFixed(2).padStart(9)}% |        19.60% | ${(jackpotObserved - 19.60).toFixed(2).padStart(6)}%`);
console.log(`2-of-a-Kind (Standard)| ${commonCount.toString().padStart(8)} | ${commonObserved.toFixed(2).padStart(9)}% |        64.65% | ${(commonObserved - 64.65).toFixed(2).padStart(6)}%`);
console.log(`No Match (Fumble)     | ${fumbleCount.toString().padStart(8)} | ${fumbleObserved.toFixed(2).padStart(9)}% |        15.75% | ${(fumbleObserved - 15.75).toFixed(2).padStart(6)}%`);
console.log('-----------------------------------------------------------------------------');
console.log(`Completed in ${elapsed} ms.\n`);
