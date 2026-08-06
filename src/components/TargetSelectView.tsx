import React from 'react';
import { Gladiator, ArchetypeId } from '../types/game';
import { ARCHETYPES, ENEMY_GLADIATORS } from '../engine/mathEngine';
import { ArrowLeft, Swords, Shield, Target, Award } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Change Archetype</span>
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>SCOUT & SELECT TARGET</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Playing as <strong style={{ color: 'var(--color-gold)' }}>{playerArch.name} ({playerArch.subName})</strong>. Choose a rival champion to challenge in the arena.
          </p>
        </div>
        <div style={{ width: '120px' }}></div>
      </div>

      {/* Target Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {ENEMY_GLADIATORS.map((enemy) => {
          const enemyArch = ARCHETYPES[enemy.archetypeId];
          const isFavored = playerArch.favoredAgainst === enemy.archetypeId;
          const isWeak = playerArch.weakAgainst === enemy.archetypeId;

          let winProbabilityText = '50% — Even Matchup';
          let winProbColor = '#f59e0b';
          if (isFavored) {
            winProbabilityText = '65% — Favorable Triangle Bonus';
            winProbColor = '#10b981';
          } else if (isWeak) {
            winProbabilityText = '35% — Tough Archetype Matchup';
            winProbColor = '#ef4444';
          }

          return (
            <div
              key={enemy.id}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: isFavored ? 'rgba(16, 185, 129, 0.4)' : isWeak ? 'rgba(239, 68, 68, 0.4)' : 'var(--color-border-gold)',
                background: 'linear-gradient(180deg, rgba(18, 22, 31, 0.95) 0%, rgba(10, 12, 16, 0.98) 100%)',
              }}
            >
              <div>
                {/* Gladiator Banner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img
                    src={enemy.avatarUrl}
                    alt={enemy.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      border: `2px solid ${isFavored ? '#10b981' : isWeak ? '#ef4444' : 'var(--color-gold)'}`,
                      objectFit: 'cover',
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.2rem' }}>{enemy.name}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>{enemy.title}</span>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.4rem', fontSize: '0.75rem', color: '#fff' }}>
                      <span>{enemyArch.icon}</span>
                      <span>{enemyArch.name}</span>
                    </div>
                  </div>
                </div>

                {/* Build Strategy */}
                <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <strong style={{ color: '#fff', display: 'block', marginBottom: '0.2rem' }}>Build Profile:</strong>
                  {enemy.buildDescription}
                </div>

                {/* HP & Record */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Shield size={16} color="#10b981" />
                    <span>HP: <strong style={{ color: '#fff' }}>{enemy.maxHp}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Award size={16} color="#f59e0b" />
                    <span>Record: <strong style={{ color: '#fff' }}>{enemy.wins}W - {enemy.losses}L</strong></span>
                  </div>
                </div>

                {/* Predicted Odds */}
                <div style={{ background: `${winProbColor}15`, border: `1px solid ${winProbColor}40`, borderRadius: '8px', padding: '0.6rem', marginBottom: '1.2rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>Estimated Win Odds</span>
                  <strong style={{ color: winProbColor, fontSize: '0.9rem' }}>{winProbabilityText}</strong>
                </div>
              </div>

              {/* Challenge Button */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem' }}
                onClick={() => onSelectTarget(enemy)}
              >
                <Swords size={18} />
                <span>CHALLENGE {enemy.name.split(' ')[0].toUpperCase()}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
