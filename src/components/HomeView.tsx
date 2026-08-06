import React from 'react';
import { Shield, Swords, Trophy, Users, Info, ChevronRight } from 'lucide-react';

interface HomeViewProps {
  onStartWar: () => void;
  onOpenMath: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartWar, onOpenMath }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner Card */}
      <div
        className="card"
        style={{
          backgroundImage: 'linear-gradient(rgba(10, 12, 16, 0.75), rgba(10, 12, 16, 0.9)), url("./assets/arena_banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '2px solid var(--color-gold)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.2)', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid var(--color-gold)', marginBottom: '1rem' }}>
          <Trophy size={18} color="#f59e0b" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.1em' }}>DAILY HOUSE WAR — CYCLE #42</span>
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#fff' }}>GLADIATOR HOUSE WARS</h2>
        <p style={{ maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Lead your Gladiator House into daily asynchronous combat. Choose your fighter archetype, scout rival champions, and turn the slot reels to claim glory for your house!
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary pulse" style={{ padding: '0.9rem 2.2rem', fontSize: '1.1rem' }} onClick={onStartWar}>
            <Swords size={22} />
            <span>ENTER WAR & SELECT GLADIATOR</span>
            <ChevronRight size={20} />
          </button>

          <button className="btn btn-secondary" style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }} onClick={onOpenMath}>
            <Info size={20} />
            <span>MATH & PROBABILITY SPEC</span>
          </button>
        </div>
      </div>

      {/* House vs House Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Player House Card */}
        <div className="card" style={{ borderColor: 'rgba(59, 130, 246, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.8rem', borderRadius: '12px', border: '1px solid #3b82f6' }}>
              <Shield size={32} color="#3b82f6" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#60a5fa', fontWeight: 700 }}>YOUR HOUSE</span>
              <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>LEGIO INVICTA</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>House Rank:</span>
              <strong style={{ color: '#fff' }}>#3 Tier I Legion</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>War Points Today:</span>
              <strong style={{ color: '#10b981' }}>4,250 PTS</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Available Attacks:</span>
              <strong style={{ color: '#f59e0b' }}>3 / 3 Remaining</strong>
            </div>
          </div>
        </div>

        {/* Rival House Card */}
        <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ef4444' }}>
              <Users size={32} color="#ef4444" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#f87171', fontWeight: 700 }}>RIVAL HOUSE</span>
              <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>GOLDEN FALCON</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>House Rank:</span>
              <strong style={{ color: '#fff' }}>#4 Tier I Legion</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>War Points Today:</span>
              <strong style={{ color: '#f87171' }}>3,890 PTS</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Roster Defense:</span>
              <strong style={{ color: '#fff' }}>4 Active Gladiators</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Presentation Callout */}
      <div className="card" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <Info size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.2rem' }}>Recruiter / Evaluator Note:</strong>
            This is the **Part A Vertical Slice Prototype** of Arena Reels. It focuses on the core 3-reel slot combat mechanics, gladiator archetype balance, probability math, and strategic target selection without requiring a live backend or login system.
          </div>
        </div>
      </div>
    </div>
  );
};
