import React, { useState } from 'react';
import { Shield, Volume2, VolumeX, BarChart2, BookOpen } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';

interface HeaderNavProps {
  onOpenProbabilityModal: () => void;
  onResetToHome: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenProbabilityModal, onResetToHome }) => {
  const [muted, setMuted] = useState(soundFx.getMuted());

  const handleToggleSound = () => {
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <header className="app-header">
      <div className="brand" onClick={onResetToHome} style={{ cursor: 'pointer' }}>
        <Shield size={32} className="text-amber-500" style={{ color: '#f59e0b' }} />
        <div>
          <h1 className="brand-title">ARENA REELS</h1>
          <span className="brand-badge">PVP WAR CONCEPT DEMO</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn btn-secondary"
          onClick={onOpenProbabilityModal}
          title="Inspect Math & Symbol Probabilities"
        >
          <BarChart2 size={18} />
          <span>Math & Odds</span>
        </button>

        <button
          className="btn btn-secondary btn-icon"
          onClick={handleToggleSound}
          title={muted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {muted ? <VolumeX size={20} color="#ef4444" /> : <Volume2 size={20} color="#10b981" />}
        </button>
      </div>
    </header>
  );
};
