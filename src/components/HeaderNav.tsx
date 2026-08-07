import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, BarChart2, Shield } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';
import { loadPlayerProfile, PlayerProfile } from '../engine/storageEngine';

interface HeaderNavProps {
  onOpenProbabilityModal: () => void;
  onResetToHome: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenProbabilityModal, onResetToHome }) => {
  const [muted, setMuted] = useState(soundFx.getMuted());
  const [musicPlaying, setMusicPlaying] = useState(soundFx.getIsMusicPlaying());
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());

  useEffect(() => {
    const handleStorageChange = () => setProfile(loadPlayerProfile());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleToggleSound = () => {
    soundFx.playClick();
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
    setMusicPlaying(soundFx.getIsMusicPlaying());
  };

  const handleToggleMusic = () => {
    soundFx.playClick();
    const isNowActive = soundFx.toggleMusic();
    setMusicPlaying(isNowActive);
  };

  return (
    <header className="app-header">
      <div
        className="brand"
        onClick={() => {
          soundFx.playClick();
          onResetToHome();
        }}
        onMouseEnter={() => soundFx.playHover()}
      >
        <h1 className="brand-title">ARENA REELS</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="brand-badge">PVP WAR</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#facc15', background: 'rgba(250, 204, 21, 0.15)', border: '1px solid rgba(250, 204, 21, 0.4)', borderRadius: '6px', padding: '0.15rem 0.45rem' }}>
            LVL {profile.level}
          </span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="header-btn"
          onClick={() => {
            soundFx.playClick();
            onOpenProbabilityModal();
          }}
          onMouseEnter={() => soundFx.playHover()}
          title="Inspect Math & Symbol Probabilities"
        >
          <BarChart2 size={16} color="#f59e0b" />
          <span>Math & Odds</span>
        </button>

        <button
          className="header-btn header-btn-icon"
          onClick={handleToggleMusic}
          onMouseEnter={() => soundFx.playHover()}
          title={musicPlaying ? 'Pause Background Music' : 'Play Background Music'}
        >
          <Music size={18} color={musicPlaying ? '#facc15' : '#6b7280'} />
        </button>

        <button
          className="header-btn header-btn-icon"
          onClick={handleToggleSound}
          onMouseEnter={() => soundFx.playHover()}
          title={muted ? 'Unmute Master Sound' : 'Mute Master Sound'}
        >
          {muted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} color="#10b981" />}
        </button>
      </div>
    </header>
  );
};


