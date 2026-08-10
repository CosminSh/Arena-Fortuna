import { Gladiator } from '../types/game';
import { simulateMatchup } from '../engine/mathEngine';

// Dedicated Web Worker for Monte Carlo simulations off the main UI thread
self.onmessage = (e: MessageEvent<{ player: Gladiator; targets: Gladiator[]; simulations?: number }>) => {
  const { player, targets, simulations = 500 } = e.data;
  const results: Record<string, { winRate: number; avgTurns: number }> = {};

  targets.forEach((enemy) => {
    const { playerWinRate, averageTurns } = simulateMatchup(player, enemy, simulations);
    results[enemy.id] = { winRate: playerWinRate, avgTurns: averageTurns };
  });

  self.postMessage(results);
};
