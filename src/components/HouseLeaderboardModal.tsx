import React, { useState } from 'react';
import { X, Trophy, Shield, Swords, Users, Crown, Zap, Flame } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';
import { loadPlayerProfile } from '../engine/storageEngine';
import { ARCHETYPES } from '../engine/mathEngine';

interface HouseLeaderboardModalProps {
  onClose: () => void;
}

interface HouseInfo {
  rank: number;
  name: string;
  badge: string;
  icon: string;
  points: number;
  winRate: string;
  members: number;
  isPlayerHouse?: boolean;
}

const LEADERBOARD_DATA: HouseInfo[] = [
  {
    rank: 1,
    name: 'Blood Sands Syndicate',
    badge: '👑 CHAMPION HOUSE',
    icon: '🩸',
    points: 14850,
    winRate: '58.2%',
    members: 48,
  },
  {
    rank: 2,
    name: 'Imperial Vanguard',
    badge: '⚔️ VANGUARD',
    icon: '🏛️',
    points: 13420,
    winRate: '55.4%',
    members: 50,
  },
  {
    rank: 3,
    name: 'Legio Invicta',
    badge: '🛡️ YOUR HOUSE',
    icon: '🛡️',
    points: 12190,
    winRate: '54.1%',
    members: 45,
    isPlayerHouse: true,
  },
  {
    rank: 4,
    name: 'Golden Falcon',
    badge: '🦅 RIVAL HOUSE',
    icon: '🦅',
    points: 11840,
    winRate: '51.8%',
    members: 42,
  },
  {
    rank: 5,
    name: 'Crimson Colosseum',
    badge: '🔥 BLOOD LINE',
    icon: '🔥',
    points: 10950,
    winRate: '49.6%',
    members: 50,
  },
];

export const HouseLeaderboardModal: React.FC<HouseLeaderboardModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'roster'>('leaderboard');
  const profile = loadPlayerProfile();

  const HOUSE_TEAMMATES = [
    {
      name: profile.playerName || 'Imperator',
      role: 'Player Champion (You)',
      archId: 'murmillo',
      level: profile.level,
      points: profile.warPoints,
      victories: profile.victories,
      avatar: ARCHETYPES.murmillo.portrait,
      isPlayer: true,
    },
    {
      name: 'Aurelia Sun-Blade',
      role: 'Veteran Thraex',
      archId: 'thraex',
      level: 4,
      points: 1620,
      victories: 21,
      avatar: ARCHETYPES.thraex.portrait,
    },
    {
      name: 'Valerius the Shield',
      role: 'Heavy Murmillo',
      archId: 'murmillo',
      level: 3,
      points: 1480,
      victories: 18,
      avatar: ARCHETYPES.murmillo.portrait,
    },
    {
      name: 'Marcus Net-Binder',
      role: 'Tactical Retiarius',
      archId: 'retiarius',
      level: 3,
      points: 1240,
      victories: 14,
      avatar: ARCHETYPES.retiarius.portrait,
    },
  ];

  return (
    <div className="modal-overlay" onClick={() => { soundFx.playClick(); onClose(); }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '1.2rem', borderColor: 'var(--color-gold)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={24} color="#f59e0b" />
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, fontFamily: 'var(--font-serif)' }}>HOUSE WAR METAGAME</h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Top Imperial Houses & Legio Invicta Roster</span>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-icon"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            onMouseEnter={() => soundFx.playHover()}
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Tug-of-War Scoreboard Header */}
        <div style={{ background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, rgba(10, 14, 22, 0.9) 100%)', border: '1px solid var(--color-gold)', borderRadius: '12px', padding: '0.6rem 0.8rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.62rem', color: '#60a5fa', fontWeight: 900, textTransform: 'uppercase' }}>YOUR HOUSE (RANK #3)</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff' }}>Legio Invicta</div>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>1,420 Wins (52.4%)</span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--color-gold)', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
              VS
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.62rem', color: '#f87171', fontWeight: 900, textTransform: 'uppercase' }}>RIVAL HOUSE (RANK #4)</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff' }}>Golden Falcon</div>
              <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 800 }}>1,290 Wins (47.6%)</span>
            </div>
          </div>

          {/* Dual Tug of War Bar */}
          <div style={{ width: '100%', height: '10px', background: '#374151', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '52.4%', background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' }} />
            <div style={{ width: '47.6%', background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.66rem', color: 'rgba(255,255,255,0.65)' }}>
            <span>🔥 War Bonus: +15% EXP per Victory</span>
            <span>⏱️ Cycle Ends: 04h 22m</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.8rem' }}>
          <button
            className={`btn ${activeTab === 'leaderboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem', fontSize: '0.78rem' }}
            onClick={() => {
              soundFx.playClick();
              setActiveTab('leaderboard');
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <Trophy size={14} />
            <span>Top 5 House Standings</span>
          </button>

          <button
            className={`btn ${activeTab === 'roster' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem', fontSize: '0.78rem' }}
            onClick={() => {
              soundFx.playClick();
              setActiveTab('roster');
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <Users size={14} />
            <span>Legio Invicta Team Roster</span>
          </button>
        </div>

        {/* TAB 1: TOP 5 LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '0.2rem' }}>
            {LEADERBOARD_DATA.map((house) => (
              <div
                key={house.rank}
                className="card"
                style={{
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: house.isPlayerHouse ? 'rgba(59, 130, 246, 0.18)' : 'rgba(12, 16, 24, 0.85)',
                  borderColor: house.isPlayerHouse ? '#3b82f6' : house.rank === 1 ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.14)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: house.rank === 1 ? '#f59e0b' : house.rank === 2 ? '#9ca3af' : house.rank === 3 ? '#d97706' : 'rgba(255,255,255,0.1)',
                      color: house.rank <= 3 ? '#000' : '#fff',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {house.rank}
                  </span>

                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff' }}>{house.name}</span>
                      <span style={{ fontSize: '0.58rem', color: house.isPlayerHouse ? '#60a5fa' : 'var(--color-gold)', fontWeight: 800 }}>
                        {house.badge}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.65)' }}>
                      {house.members} Gladiators Active • Win Rate {house.winRate}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#facc15' }}>
                    {house.points.toLocaleString()} PTS
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: YOUR HOUSE TEAM ROSTER */}
        {activeTab === 'roster' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '0.2rem' }}>
            {HOUSE_TEAMMATES.map((gladiator, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: gladiator.isPlayer ? 'rgba(245, 158, 11, 0.18)' : 'rgba(12, 16, 24, 0.85)',
                  borderColor: gladiator.isPlayer ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.14)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img
                    src={gladiator.avatar}
                    alt={gladiator.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid var(--color-gold)', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#fff' }}>{gladiator.name}</span>
                      {gladiator.isPlayer && (
                        <span style={{ fontSize: '0.58rem', background: '#f59e0b', color: '#000', padding: '0.05rem 0.3rem', borderRadius: '4px', fontWeight: 900 }}>
                          YOU
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.66rem', color: '#60a5fa', fontWeight: 700 }}>
                      {gladiator.role} • LVL {gladiator.level}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#10b981' }}>
                    +{gladiator.points} PTS
                  </div>
                  <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.65)' }}>
                    {gladiator.victories} War Victories
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.55rem', fontSize: '0.82rem', marginTop: '0.8rem', justifyContent: 'center' }}
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
        >
          CLOSE METAGAME HUB
        </button>
      </div>
    </div>
  );
};
