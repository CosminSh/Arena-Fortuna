import React from 'react';
import { Shield, Swords, Info, Trophy, ChevronRight, User, Sparkles, Users } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';
import { loadPlayerProfile } from '../engine/storageEngine';
import { ARCHETYPES } from '../engine/mathEngine';

interface HomeViewProps {
  onStartWar: () => void;
  onOpenGladiatorHub: () => void;
  onOpenMath: () => void;
  onOpenLeaderboard: () => void;
  onOpenTutorial: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartWar, onOpenGladiatorHub, onOpenMath, onOpenLeaderboard, onOpenTutorial }) => {
  const profile = loadPlayerProfile();

  const teammates = [
    { name: profile.playerName || 'Imperator', avatar: ARCHETYPES.murmillo.portrait, isSelf: true },
    { name: 'Aurelia', avatar: ARCHETYPES.thraex.portrait },
    { name: 'Valerius', avatar: ARCHETYPES.murmillo.portrait },
    { name: 'Marcus', avatar: ARCHETYPES.retiarius.portrait },
  ];

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
        padding: '0.6rem 0',
      }}
    >
      {/* Top Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(245, 158, 11, 0.15)',
          padding: '0.3rem 0.85rem',
          borderRadius: '20px',
          border: '1px solid var(--color-gold)',
          cursor: 'pointer',
        }}
        onClick={() => {
          soundFx.playClick();
          onOpenLeaderboard();
        }}
        onMouseEnter={() => soundFx.playHover()}
      >
        <Trophy size={15} color="#f59e0b" />
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em' }}>
          DAILY HOUSE WAR — CYCLE #42 (TAP FOR STANDINGS)
        </span>
      </div>

      {/* Centerpiece Visual Hero Card */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundImage: 'linear-gradient(180deg, rgba(8, 10, 15, 0.5) 0%, rgba(8, 10, 15, 0.95) 100%), url("./assets/arena_banner.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '1.4rem 1.1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem',
          border: '2px solid var(--color-gold)',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.35)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <img
            src="./assets/Arena-Fortuna-logo-transparent.png"
            alt="Arena Fortuna Logo"
            style={{ height: '75px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.6))' }}
          />
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', textShadow: '0 2px 12px #000', margin: 0, fontFamily: 'var(--font-serif)' }}>
            ARENA FORTUNA
          </h2>
        </div>

        {/* Dynamic House War Scoreboard */}
        <div style={{ width: '100%', background: 'rgba(0, 0, 0, 0.72)', padding: '0.65rem 0.8rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.18)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.4rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.62rem', color: '#60a5fa', fontWeight: 900, textTransform: 'uppercase' }}>YOUR HOUSE</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff' }}>LEGIO INVICTA</div>
              <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 800 }}>1,420 Wins (Rank #3)</span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--color-gold)', background: 'rgba(255,255,255,0.08)', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>VS</div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.62rem', color: '#f87171', fontWeight: 900, textTransform: 'uppercase' }}>RIVAL HOUSE</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff' }}>GOLDEN FALCON</div>
              <span style={{ fontSize: '0.68rem', color: '#f87171', fontWeight: 800 }}>1,290 Wins (Rank #4)</span>
            </div>
          </div>

          {/* Tug-of-War Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: '#374151', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '52.4%', background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' }} />
            <div style={{ width: '47.6%', background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' }} />
          </div>
        </div>

        {/* House Teammate Avatars Preview Strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', background: 'rgba(0,0,0,0.5)', padding: '0.35rem 0.8rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)' }}>
          <span style={{ fontSize: '0.66rem', color: 'var(--color-gold)', fontWeight: 800, textTransform: 'uppercase' }}>House Squad:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '-0.3rem' }}>
            {teammates.map((tm, idx) => (
              <img
                key={idx}
                src={tm.avatar}
                alt={tm.name}
                title={tm.name}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: tm.isSelf ? '2px solid var(--color-gold)' : '1.5px solid rgba(255,255,255,0.4)',
                  objectFit: 'cover',
                  marginLeft: idx > 0 ? '-6px' : 0,
                  zIndex: teammates.length - idx,
                }}
              />
            ))}
          </div>
        </div>

        {/* 2 MAIN BUTTONS: MY GLADIATOR & ENTER ARENA WAR */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.98rem', borderRadius: '22px', borderColor: 'var(--color-gold)', background: 'rgba(245, 158, 11, 0.15)' }}
            onClick={() => {
              soundFx.playClick();
              onOpenGladiatorHub();
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <User size={18} color="#f59e0b" />
            <span style={{ color: '#fff', fontWeight: 900 }}>MY GLADIATOR & GEAR</span>
            <Sparkles size={15} color="#f59e0b" />
          </button>

          <button
            className="btn btn-primary pulse"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1.1rem', borderRadius: '22px' }}
            onClick={() => {
              soundFx.playClick();
              onStartWar();
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <Swords size={20} />
            <span>ENTER ARENA WAR</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Bottom Quick Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', borderColor: 'var(--color-gold)', background: 'rgba(250, 204, 21, 0.1)' }}
          onClick={() => {
            soundFx.playClick();
            onOpenTutorial();
          }}
          onMouseEnter={() => soundFx.playHover()}
        >
          <img src="./assets/Fortuna-NPC-torso.png" alt="Queen Fortuna" style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: '#facc15' }}>Queen Fortuna's Guidance</span>
        </button>

        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
          onClick={() => {
            soundFx.playClick();
            onOpenLeaderboard();
          }}
          onMouseEnter={() => soundFx.playHover()}
        >
          <Trophy size={14} color="#f59e0b" />
          <span>House Leaderboard & Squad</span>
        </button>

        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
          onClick={() => {
            soundFx.playClick();
            onOpenMath();
          }}
          onMouseEnter={() => soundFx.playHover()}
        >
          <Info size={14} />
          <span>Combat Rules & Math</span>
        </button>
      </div>
    </div>
  );
};

