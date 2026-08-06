import React, { useMemo } from 'react';
import { Gladiator } from '../types/game';
import { ARCHETYPES, ENEMY_GLADIATORS, simulateMatchup } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { ArrowLeft, Swords, Activity } from 'lucide-react';

interface TargetSelectViewProps {
  playerGladiator: Gladiator;
  onSelectTarget: (enemy: Gladiator) => void;
  onBack: () => void;
}

export const TargetSelectView: React.FC<TargetSelectViewProps> = ({
  playerGladiator,
  onSelectTarget,
  onBack,
}) => {
  const playerArch = ARCHETYPES[playerGladiator.archetypeId];

  // Run 1,000 Monte Carlo combat simulations for each enemy against current player build
  const simResults = useMemo(() => {
    const results: Record<string, { winRate: number; avgTurns: number }> = {};
    ENEMY_GLADIATORS.forEach((enemy) => {
      const { playerWinRate, averageTurns } = simulateMatchup(playerGladiator, enemy, 1000);
      results[enemy.id] = { winRate: playerWinRate, avgTurns: averageTurns };
    });
    return results;
  }, [playerGladiator]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.5rem',
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          onMouseEnter={() => soundFx.playHover()}
        >
          <ArrowLeft size={16} />
          <span>Change Archetype</span>
        </button>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', textAlign: 'center' }}>SCOUT RIVAL TARGETS</h2>
        <div style={{ width: '60px' }}></div>
      </div>

      {/* 2x2 Target Cards Grid (Fits cleanly on mobile) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', flex: 1, maxHeight: 'calc(100vh - 120px)' }}>
        {ENEMY_GLADIATORS.map((enemy) => {
          const enemyArch = ARCHETYPES[enemy.archetypeId];
          const isFavored = playerArch.favoredAgainst === enemy.archetypeId;
          const isWeak = playerArch.weakAgainst === enemy.archetypeId;
          const sim = simResults[enemy.id] || { winRate: 50, avgTurns: 5 };

          let matchupLabel = 'Neutral Matchup';
          let winProbColor = '#f59e0b';
          if (isFavored) {
            matchupLabel = 'Favored Matchup (+15%)';
            winProbColor = '#10b981';
          } else if (isWeak) {
            matchupLabel = 'Difficult Matchup (-15%)';
            winProbColor = '#ef4444';
          }

          if (sim.winRate >= 60) winProbColor = '#10b981';
          else if (sim.winRate <= 40) winProbColor = '#ef4444';

          return (
            <div
              key={enemy.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem',
                textAlign: 'center',
                cursor: 'pointer',
                borderColor: winProbColor,
                background: 'linear-gradient(180deg, rgba(18, 22, 31, 0.95) 0%, rgba(10, 12, 16, 0.98) 100%)',
              }}
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => {
                soundFx.playClick();
                onSelectTarget(enemy);
              }}
            >
              {/* Avatar & Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={enemy.avatarUrl}
                  alt={enemy.name}
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    border: `2px solid ${winProbColor}`,
                    objectFit: 'cover',
                  }}
                />
                <h3 style={{ fontSize: '0.9rem', color: '#fff', marginTop: '0.2rem' }}>{enemy.name}</h3>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                  {enemyArch.name} ({enemy.currentHp} HP, {enemy.shieldCharges} Shield)
                </span>
              </div>

              {/* Matchup & Monte Carlo Simulated Odds */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-gold)', textTransform: 'uppercase' }}>
                  {matchupLabel}
                </span>
                <div
                  style={{
                    background: `${winProbColor}20`,
                    border: `1px solid ${winProbColor}60`,
                    borderRadius: '10px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: winProbColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Activity size={12} />
                  <span>{sim.winRate}% Simulated Win Rate</span>
                </div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>
                  (1,000 Sim Battles | ~{sim.avgTurns} Turns)
                </span>
              </div>

              {/* Challenge Button */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem', borderRadius: '8px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  onSelectTarget(enemy);
                }}
                onMouseEnter={() => soundFx.playHover()}
              >
                <Swords size={14} />
                <span>FIGHT</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
