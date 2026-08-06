import React, { useState } from 'react';
import { ARCHETYPES } from '../engine/mathEngine';
import { ArchetypeId } from '../types/game';
import { soundFx } from '../engine/audioEngine';
import { ArrowLeft, Zap, Info, ChevronRight, Check } from 'lucide-react';

interface ArchetypeSelectViewProps {
  onSelectArchetype: (archetypeId: ArchetypeId) => void;
  onBack: () => void;
}

export const ArchetypeSelectView: React.FC<ArchetypeSelectViewProps> = ({ onSelectArchetype, onBack }) => {
  const [activeInfoId, setActiveInfoId] = useState<ArchetypeId | null>(null);

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
          <span>Back</span>
        </button>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', textAlign: 'center' }}>CHOOSE YOUR FIGHTER</h2>
        <div style={{ width: '60px' }}></div>
      </div>

      {/* 3 Hero Avatar Cards Grid (Fits cleanly on mobile screen) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', flex: 1, maxHeight: 'calc(100vh - 120px)' }}>
        {(Object.keys(ARCHETYPES) as ArchetypeId[]).map((id) => {
          const arch = ARCHETYPES[id];
          return (
            <div
              key={id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                borderColor: 'var(--color-border-gold)',
                background: 'linear-gradient(180deg, rgba(20, 25, 36, 0.95) 0%, rgba(10, 12, 16, 0.98) 100%)',
              }}
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => {
                soundFx.playClick();
                onSelectArchetype(id);
              }}
            >
              {/* Portrait & Icon */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={arch.portrait}
                  alt={arch.name}
                  style={{
                    width: '75px',
                    height: '75px',
                    borderRadius: '50%',
                    border: '3px solid var(--color-gold)',
                    objectFit: 'cover',
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
                  }}
                />
                <span style={{ fontSize: '1.6rem', marginTop: '-12px', zIndex: 2 }}>{arch.icon}</span>
              </div>

              {/* Title */}
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.1rem' }}>{arch.name}</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                  {arch.subName}
                </span>
              </div>

              {/* Ability Badge */}
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '0.4rem', width: '100%' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                  <Zap size={12} />
                  <span>{arch.abilityName}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', borderRadius: '8px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  onSelectArchetype(id);
                }}
                onMouseEnter={() => soundFx.playHover()}
              >
                <span>CHOOSE</span>
                <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
