import React from 'react';
import { Shield, Swords, Info, Trophy, ChevronRight, User, Sparkles } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';

interface HomeViewProps {
  onStartWar: () => void;
  onOpenGladiatorHub: () => void;
  onOpenMath: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartWar, onOpenGladiatorHub, onOpenMath }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        padding: '0.8rem 0',
      }}
    >
      {/* Top Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(245, 158, 11, 0.15)',
          padding: '0.35rem 0.9rem',
          borderRadius: '20px',
          border: '1px solid var(--color-gold)',
        }}
      >
        <Trophy size={16} color="#f59e0b" />
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em' }}>
          DAILY HOUSE WAR — CYCLE #42
        </span>
      </div>

      {/* Centerpiece Visual Hero Card */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundImage: 'linear-gradient(180deg, rgba(8, 10, 15, 0.5) 0%, rgba(8, 10, 15, 0.95) 100%), url("./assets/arena_banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '1.8rem 1.2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          border: '2px solid var(--color-gold)',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield size={38} color="#f59e0b" />
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', textShadow: '0 2px 10px #000' }}>
            ARENA REELS
          </h2>
        </div>

        {/* Verses House Banner */}
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center', background: 'rgba(0, 0, 0, 0.65)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <div>
            <span style={{ fontSize: '0.68rem', color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase' }}>YOUR HOUSE</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff' }}>LEGIO INVICTA</div>
            <span style={{ fontSize: '0.7rem', color: '#10b981' }}>Rank #3</span>
          </div>

          <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--color-gold)' }}>VS</div>

          <div>
            <span style={{ fontSize: '0.68rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase' }}>RIVAL HOUSE</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff' }}>GOLDEN FALCON</div>
            <span style={{ fontSize: '0.7rem', color: '#f87171' }}>Rank #4</span>
          </div>
        </div>

        {/* 2 MAIN BUTTONS: MY GLADIATOR & ENTER ARENA WAR */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', borderRadius: '25px', borderColor: 'var(--color-gold)', background: 'rgba(245, 158, 11, 0.15)' }}
            onClick={() => {
              soundFx.playClick();
              onOpenGladiatorHub();
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <User size={20} color="#f59e0b" />
            <span style={{ color: '#fff', fontWeight: 900 }}>MY GLADIATOR & GEAR</span>
            <Sparkles size={16} color="#f59e0b" />
          </button>

          <button
            className="btn btn-primary pulse"
            style={{ width: '100%', padding: '0.95rem', fontSize: '1.15rem', borderRadius: '25px' }}
            onClick={() => {
              soundFx.playClick();
              onStartWar();
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <Swords size={22} />
            <span>ENTER ARENA WAR</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Quick Info Toggle */}
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }}
          onClick={() => {
            soundFx.playClick();
            onOpenMath();
          }}
          onMouseEnter={() => soundFx.playHover()}
        >
          <Info size={14} />
          <span>Combat Rules & Math Drawer</span>
        </button>
      </div>
    </div>
  );
};
