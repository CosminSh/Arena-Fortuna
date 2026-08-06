import React, { useState } from 'react';
import { Volume2, VolumeX, Music, BarChart2 } from 'lucide-react';
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
      >
        <h1 className="brand-title">ARENA REELS</h1>
        <span className="brand-badge">PVP WAR CONCEPT DEMO</span>
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

