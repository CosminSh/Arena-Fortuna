import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, BarChart2, Trophy, Maximize2, Minimize2 } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';
import { loadPlayerProfile, PlayerProfile } from '../engine/storageEngine';

interface HeaderNavProps {
  onOpenProbabilityModal: () => void;
  onOpenTutorial: () => void;
  onOpenLeaderboard: () => void;
  onResetToHome: () => void;
  currentViewMode?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenProbabilityModal,
  onOpenTutorial,
  onOpenLeaderboard,
  onResetToHome,
  currentViewMode = 'home',
}) => {
  const [muted, setMuted] = useState(soundFx.getMuted());
  const [musicPlaying, setMusicPlaying] = useState(soundFx.getIsMusicPlaying());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());

  useEffect(() => {
    const handleStorageChange = () => setProfile(loadPlayerProfile());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!(document as any).webkitFullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
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

  const handleToggleFullscreen = () => {
    soundFx.playClick();
    const doc = document as any;
    const docEl = document.documentElement as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
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
        <img
          src="./assets/Arena-Fortuna-logo-transparent.png"
          alt="Arena Fortuna Logo"
          className="brand-logo"
          style={{ height: '30px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
        />
        <h1 className="brand-title">ARENA FORTUNA</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          <span className="brand-badge">PVP WAR</span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 900,
              color: '#facc15',
              background: 'rgba(250, 204, 21, 0.15)',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '6px',
              padding: '0.15rem 0.45rem',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            LVL {profile.level}
          </span>
        </div>
      </div>

      <div className="header-actions">
        {/* House Leaderboard & Squad Button */}
        <button
          id="nav-leaderboard-btn"
          className="header-btn"
          onClick={() => {
            soundFx.playClick();
            onOpenLeaderboard();
          }}
          onMouseEnter={() => soundFx.playHover()}
          title="House Leaderboard & Squad Standings"
          style={{ border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.1)' }}
        >
          <Trophy size={15} color="#f59e0b" />
          <span className="hide-mobile-sm" style={{ color: '#f59e0b' }}>Rankings</span>
        </button>

        {/* Dynamic Contextual Help / Guide Button */}
        {(() => {
          let guideLabel = 'Guide';
          let guideTitle = "Queen Fortuna's Gladiator Tutorial & Guide";
          if (currentViewMode === 'battle') {
            guideLabel = 'Combat Help';
            guideTitle = 'Combat Reels & Battle Tactics Help';
          } else if (currentViewMode === 'target') {
            guideLabel = 'Scout Help';
            guideTitle = 'Scouting & Archetype Counter Help';
          } else if (currentViewMode === 'gladiator') {
            guideLabel = 'Armory Help';
            guideTitle = 'Gladiator & Equipment Loadout Help';
          }

          return (
            <button
              id="nav-guide-btn"
              className="header-btn"
              onClick={() => {
                soundFx.playClick();
                onOpenTutorial();
              }}
              onMouseEnter={() => soundFx.playHover()}
              title={guideTitle}
              style={{ border: '1px solid rgba(250, 204, 21, 0.4)', background: 'rgba(250, 204, 21, 0.12)' }}
            >
              <img
                src="./assets/Fortuna-NPC-torso.png"
                alt="Queen Fortuna"
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #facc15' }}
              />
              <span className="hide-mobile-xs" style={{ color: '#facc15' }}>{guideLabel}</span>
            </button>
          );
        })()}

        {/* Combat Odds / Math Button */}
        <button
          id="nav-odds-btn"
          className="header-btn"
          onClick={() => {
            soundFx.playClick();
            onOpenProbabilityModal();
          }}
          onMouseEnter={() => soundFx.playHover()}
          title="Inspect Math & Symbol Probabilities"
        >
          <BarChart2 size={15} color="#f59e0b" />
          <span className="hide-mobile-sm">Odds</span>
        </button>

        {/* Background Music Toggle */}
        <button
          className="header-btn header-btn-icon"
          onClick={handleToggleMusic}
          onMouseEnter={() => soundFx.playHover()}
          title={musicPlaying ? 'Pause Background Music' : 'Play Background Music'}
        >
          <Music size={15} color={musicPlaying ? '#facc15' : '#6b7280'} />
        </button>

        {/* Master Sound FX Toggle */}
        <button
          className="header-btn header-btn-icon"
          onClick={handleToggleSound}
          onMouseEnter={() => soundFx.playHover()}
          title={muted ? 'Unmute Master Sound' : 'Mute Master Sound'}
        >
          {muted ? <VolumeX size={15} color="#ef4444" /> : <Volume2 size={15} color="#10b981" />}
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          id="nav-fullscreen-btn"
          className="header-btn header-btn-icon"
          onClick={handleToggleFullscreen}
          onMouseEnter={() => soundFx.playHover()}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={15} color="#facc15" /> : <Maximize2 size={15} color="#d1d5db" />}
        </button>
      </div>
    </header>
  );
};
