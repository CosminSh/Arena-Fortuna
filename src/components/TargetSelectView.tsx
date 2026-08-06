import React from 'react';
import { Gladiator, ArchetypeId } from '../types/game';
import { ARCHETYPES, ENEMY_GLADIATORS } from '../engine/mathEngine';
import { ArrowLeft, Swords } from 'lucide-react';

interface TargetSelectViewProps {
  playerArchetypeId: ArchetypeId;
  onSelectTarget: (enemy: Gladiator) => void;
  onBack: () => void;
}

export const TargetSelectView: React.FC<TargetSelectViewProps> = ({
  playerArchetypeId,
  onSelectTarget,
  onBack,
}) => {
  const playerArch = ARCHETYPES[playerArchetypeId];

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
        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Change Archetype</span>
        </button>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', textAlign: 'center' }}>SELECT ENEMY TARGET</h2>
        <div style={{ width: '60px' }}></div>
      </div>

      {/* 2x2 Target Cards Grid (Fits cleanly on mobile) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', flex: 1, maxHeight: 'calc(100vh - 120px)' }}>
        {ENEMY_GLADIATORS.map((enemy) => {
          const enemyArch = ARCHETYPES[enemy.archetypeId];
          const isFavored = playerArch.favoredAgainst === enemy.archetypeId;
          const isWeak = playerArch.weakAgainst === enemy.archetypeId;

          let winProbabilityText = '50% Even';
          let winProbColor = '#f59e0b';
          if (isFavored) {
            winProbabilityText = '65% Favored';
            winProbColor = '#10b981';
          } else if (isWeak) {
            winProbabilityText = '35% Tough';
            winProbColor = '#ef4444';
          }

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
                borderColor: isFavored ? '#10b981' : isWeak ? '#ef4444' : 'var(--color-border-gold)',
                background: 'linear-gradient(180deg, rgba(18, 22, 31, 0.95) 0%, rgba(10, 12, 16, 0.98) 100%)',
              }}
              onClick={() => onSelectTarget(enemy)}
            >
              {/* Avatar & Badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={enemy.avatarUrl}
                  alt={enemy.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: `2px solid ${winProbColor}`,
                    objectFit: 'cover',
                  }}
                />
                <h3 style={{ fontSize: '0.9rem', color: '#fff', marginTop: '0.2rem' }}>{enemy.name}</h3>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{enemyArch.name}</span>
              </div>

              {/* Odds pill */}
              <div style={{ background: `${winProbColor}20`, border: `1px solid ${winProbColor}60`, borderRadius: '12px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 800, color: winProbColor }}>
                {winProbabilityText}
              </div>

              {/* Challenge Button */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem', borderRadius: '8px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTarget(enemy);
                }}
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
