import React, { useState } from 'react';
import { Shield, Volume2, VolumeX, Music, BarChart2 } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';

interface HeaderNavProps {
  onOpenProbabilityModal: () => void;
  onResetToHome: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenProbabilityModal, onResetToHome }) => {
  const [muted, setMuted] = useState(soundFx.getMuted());
  const [musicPlaying, setMusicPlaying] = useState(soundFx.getIsMusicPlaying());

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
        style={{ cursor: 'pointer' }}
      >
        <Shield size={32} className="text-amber-500" style={{ color: '#f59e0b' }} />
        <div>
          <h1 className="brand-title">ARENA REELS</h1>
          <span className="brand-badge">PVP WAR CONCEPT DEMO</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn btn-secondary"
          onClick={() => {
            soundFx.playClick();
            onOpenProbabilityModal();
          }}
          onMouseEnter={() => soundFx.playHover()}
          title="Inspect Math & Symbol Probabilities"
        >
          <BarChart2 size={18} />
          <span>Math & Odds</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleToggleMusic}
          onMouseEnter={() => soundFx.playHover()}
          title={musicPlaying ? 'Pause Background Music' : 'Play Background Music'}
          style={{ padding: '0.4rem 0.7rem', fontSize: '0.78rem', borderColor: musicPlaying ? '#facc15' : 'rgba(255,255,255,0.2)' }}
        >
          <Music size={16} color={musicPlaying ? '#facc15' : '#9ca3af'} />
          <span style={{ color: musicPlaying ? '#facc15' : '#9ca3af' }}>
            {musicPlaying ? 'MUSIC ON' : 'MUSIC OFF'}
          </span>
        </button>

        <button
          className="btn btn-secondary btn-icon"
          onClick={handleToggleSound}
          onMouseEnter={() => soundFx.playHover()}
          title={muted ? 'Unmute Master Sound' : 'Mute Master Sound'}
        >
          {muted ? <VolumeX size={20} color="#ef4444" /> : <Volume2 size={20} color="#10b981" />}
        </button>
      </div>
    </header>
  );
};
