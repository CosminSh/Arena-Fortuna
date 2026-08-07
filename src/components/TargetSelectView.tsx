import React, { useState, useMemo } from 'react';
import { Gladiator } from '../types/game';
import { ARCHETYPES, getRandomScoutingTargets, simulateMatchup } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { ArrowLeft, Swords, Activity, RefreshCw, Shield, Sparkles } from 'lucide-react';

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
  const [activeTargets, setActiveTargets] = useState<Gladiator[]>(() => getRandomScoutingTargets(4));
  const playerArch = ARCHETYPES[playerGladiator.archetypeId];

  const handleRefresh = () => {
    soundFx.playClick();
    setActiveTargets(getRandomScoutingTargets(4));
  };

  // Run Monte Carlo combat simulations for active targets
  const simResults = useMemo(() => {
    const results: Record<string, { winRate: number; avgTurns: number }> = {};
    activeTargets.forEach((enemy) => {
      const { playerWinRate, averageTurns } = simulateMatchup(playerGladiator, enemy, 500);
      results[enemy.id] = { winRate: playerWinRate, avgTurns: averageTurns };
    });
    return results;
  }, [playerGladiator, activeTargets]);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          onMouseEnter={() => soundFx.playHover()}
        >
          <ArrowLeft size={15} />
          <span>Archetype</span>
        </button>

        <h2 style={{ fontSize: '1.15rem', color: '#fff', textAlign: 'center', margin: 0 }}>
          SCOUT RIVAL TARGETS
        </h2>

        <button
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: 'var(--color-gold)' }}
          onClick={handleRefresh}
          onMouseEnter={() => soundFx.playHover()}
        >
          <RefreshCw size={14} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* 2x2 Target Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', flex: 1, maxHeight: 'calc(100vh - 110px)' }}>
        {activeTargets.map((enemy) => {
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

          const hasEquippedGear = enemy.equippedGear && (enemy.equippedGear.weapon || enemy.equippedGear.armor || enemy.equippedGear.crest);

          return (
            <div
              key={enemy.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem',
                textAlign: 'center',
                cursor: 'pointer',
                borderColor: winProbColor,
                background: 'linear-gradient(180deg, rgba(18, 22, 31, 0.95) 0%, rgba(10, 12, 16, 0.98) 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => {
                soundFx.playClick();
                onSelectTarget(enemy);
              }}
            >
              {/* Gear Badge Indicator */}
              {hasEquippedGear && (
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid var(--color-gold)',
                    borderRadius: '6px',
                    padding: '0.15rem 0.35rem',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    color: 'var(--color-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <Sparkles size={10} />
                  <span>ARMORED</span>
                </div>
              )}

              {/* Avatar & Info */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <img
                  src={enemy.avatarUrl}
                  alt={enemy.name}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: `2px solid ${winProbColor}`,
                    objectFit: 'cover',
                  }}
                />
                <h3 style={{ fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                  {enemy.name}
                </h3>
                <span style={{ fontSize: '0.64rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                  {enemy.houseName}
                </span>
                <span style={{ fontSize: '0.64rem', color: 'var(--color-text-muted)' }}>
                  {enemyArch.name} ({enemy.currentHp} HP, {enemy.shieldCharges} Shield)
                </span>
              </div>

              {/* Matchup & Monte Carlo Simulated Odds */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: winProbColor, textTransform: 'uppercase' }}>
                  {matchupLabel}
                </span>
                <div
                  style={{
                    background: `${winProbColor}20`,
                    border: `1px solid ${winProbColor}60`,
                    borderRadius: '8px',
                    padding: '0.2rem 0.45rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    color: winProbColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Activity size={11} />
                  <span>{sim.winRate}% Sim Win Rate</span>
                </div>
              </div>

              {/* Challenge Button */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.35rem', fontSize: '0.75rem', borderRadius: '8px', marginTop: '0.2rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  onSelectTarget(enemy);
                }}
                onMouseEnter={() => soundFx.playHover()}
              >
                <Swords size={13} />
                <span>CHALLENGE</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

