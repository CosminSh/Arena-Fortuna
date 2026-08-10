import {
  getGearStats,
  evaluateCombination,
  resolveTurn,
  simulateMatchup,
  spinReels,
  AVAILABLE_GEAR,
  ARCHETYPES,
} from '../src/engine/mathEngine';
import { Gladiator } from '../src/types/game';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

console.log('====================================================');
console.log('  ARENA FORTUNA — MATH & COMBAT ENGINE TEST SUITE   ');
console.log('====================================================\n');

// Test 1: getGearStats Helper
console.log('Test 1: getGearStats Helper');
const testLoadout = {
  weapon: AVAILABLE_GEAR[2], // Weighted Trident (Damage: 6, Shield: 8, HP: 10)
  armor: AVAILABLE_GEAR[3],  // Imperial Scutum Guard (Damage: 0, Shield: 16, HP: 10)
  crest: AVAILABLE_GEAR[6],  // Champion Golden Laurel (Damage: 6, Shield: 8, HP: 12)
};
const stats = getGearStats(testLoadout);
assert(stats.damageBonus === 6 + 0 + 6, 'Damage bonus calculated correctly across all slots (6 + 0 + 6 = 12)');
assert(stats.shieldBonus === 8 + 16 + 8, 'Shield bonus calculated correctly across all slots (8 + 16 + 8 = 32)');
assert(stats.hpBonus === 10 + 10 + 12, 'Max HP bonus calculated correctly across all slots (10 + 10 + 12 = 32)');

// Test 2: Symbol Combination Evaluation
console.log('\nTest 2: Symbol Combination Evaluation');
const jackpotResult = evaluateCombination(['sword', 'sword', 'sword']);
assert(jackpotResult.tier === 'jackpot' && jackpotResult.matchCount === 3, '3-of-a-Kind evaluates to Jackpot');

const commonResult = evaluateCombination(['sword', 'sword', 'shield']);
assert(commonResult.tier === 'common' && commonResult.matchCount === 2, '2-of-a-Kind evaluates to Common');

const fumbleResult = evaluateCombination(['sword', 'shield', 'class']);
assert(fumbleResult.tier === 'fumble' && fumbleResult.matchCount === 1, '0-Match evaluates to Fumble');

const wildResult = evaluateCombination(['sword', 'wild', 'class'], 'sword');
assert(wildResult.tier === 'common' && wildResult.primarySymbol === 'sword', 'Wild resolves correctly to requested symbol');

// Test 3: resolveTurn Combat Resolution
console.log('\nTest 3: resolveTurn Combat Resolution');
const dummyPlayer: Gladiator = {
  id: 'p1',
  name: 'Tester',
  archetypeId: 'thraex',
  maxHp: 100,
  currentHp: 100,
  shieldCharges: 0,
  houseName: 'House Invicta',
  isPlayer: true,
  avatarUrl: '',
};

const dummyEnemy: Gladiator = {
  id: 'e1',
  name: 'Rival',
  archetypeId: 'murmillo',
  maxHp: 100,
  currentHp: 100,
  shieldCharges: 0,
  houseName: 'Rival Ludus',
  isPlayer: false,
  avatarUrl: '',
};

// Thraex gets +15% triangle bonus against Murmillo
const turnRes = resolveTurn(1, dummyPlayer, dummyEnemy, ['sword', 'sword', 'sword'], false, false);
assert(turnRes.outcome.rawDamage === Math.round(40 * 1.15), 'Archetype triangle +15% bonus applied correctly');
assert(turnRes.outcome.netDamage > 0, 'Net damage dealt to enemy');

// Test 4: Streak Multiplier
console.log('\nTest 4: Streak Multiplier (+5% per streak tier)');
const streakRes = resolveTurn(1, dummyPlayer, dummyEnemy, ['sword', 'sword', 'sword'], false, false, undefined, 3);
// Streak x3 gives +10% damage bonus
const expectedStreakDmg = Math.round(Math.round(40 * 1.15) * 1.10);
assert(streakRes.outcome.rawDamage === expectedStreakDmg, 'Streak x3 bonus multiplier (+10%) applied');

// Test 5: Monte Carlo Matchup Simulation
console.log('\nTest 5: Monte Carlo Simulation Engine');
const simResult = simulateMatchup(dummyPlayer, dummyEnemy, 200);
assert(simResult.playerWinRate >= 0 && simResult.playerWinRate <= 100, 'Monte Carlo player win rate within 0-100%');
assert(simResult.averageTurns >= 1 && simResult.averageTurns <= 8, 'Average turns bounded within 1-8 turns');

console.log('\n====================================================');
console.log('  ALL TESTS PASSED SUCCESSFULLY!                    ');
console.log('====================================================\n');
