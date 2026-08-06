import React from 'react';
import { ARCHETYPES } from '../engine/mathEngine';
import { ArchetypeId } from '../types/game';
import { Shield, Zap, Target, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ArchetypeSelectViewProps {
  onSelectArchetype: (archetypeId: ArchetypeId) => void;
  onBack: () => void;
}

export const ArchetypeSelectView: React.FC<ArchetypeSelectViewProps> = ({ onSelectArchetype, onBack }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back to House</span>
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>SELECT YOUR GLADIATOR</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Choose an archetype for this battle encounter. Each archetype features unique slot abilities and triangle matchup advantages.
          </p>
        </div>
        <div style={{ width: '120px' }}></div>
      </div>

      {/* Archetype Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
        {(Object.keys(ARCHETYPES) as ArchetypeId[]).map((id) => {
          const arch = ARCHETYPES[id];
          return (
            <div
              key={id}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: 'var(--color-border-gold)',
                background: 'linear-gradient(180deg, rgba(20, 25, 36, 0.9) 0%, rgba(12, 14, 20, 0.95) 100%)',
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img
                    src={arch.portrait}
                    alt={arch.name}
                    style={{
                      width: '75px',
                      height: '75px',
                      borderRadius: '50%',
                      border: '2px solid var(--color-gold)',
                      objectFit: 'cover',
                    }}
                  />
                  <div>
                    <span style={{ fontSize: '1.8rem' }}>{arch.icon}</span>
                    <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>{arch.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                      {arch.subName}
                    </span>
                  </div>
                </div>

                {/* Identity & Equipment */}
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem', minHeight: '40px' }}>
                  {arch.identity}
                </p>

                <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Weapon:</span>
                    <strong style={{ color: '#fff' }}>{arch.weapon}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Shield / Guard:</span>
                    <strong style={{ color: '#fff' }}>{arch.shield}</strong>
                  </div>
                </div>

                {/* Ability Box */}
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '0.9rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Zap size={16} color="#f59e0b" />
                    <strong style={{ color: '#f59e0b', fontSize: '0.9rem' }}>ABILITY: {arch.abilityName}</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#e5e7eb' }}>{arch.abilityDesc}</p>
                </div>

                {/* Matchup Triangle Advantage */}
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>Strong vs: <strong style={{ color: '#10b981' }}>{ARCHETYPES[arch.favoredAgainst].name}</strong> (+15% Bonus)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Target size={14} color="#ef4444" />
                    <span>Vulnerable to: <strong style={{ color: '#f87171' }}>{ARCHETYPES[arch.weakAgainst].name}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem' }}
                onClick={() => onSelectArchetype(id)}
              >
                <span>SELECT {arch.name.toUpperCase()}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
