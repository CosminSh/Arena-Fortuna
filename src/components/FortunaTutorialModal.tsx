import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Swords, BarChart2, Shield, Sparkles, Crown, Check, User } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';
import { setTutorialCompleted, updatePlayerName, loadPlayerProfile } from '../engine/storageEngine';

interface FortunaTutorialModalProps {
  onClose: () => void;
  onStartFirstFight: () => void;
  currentViewMode?: string;
}

interface StepConfig {
  step: number;
  targetId: string;
  title: string;
  badge: string;
  dialogue: string;
  buttonLabel?: string;
  action?: 'navigate_target' | 'complete';
}

const TUTORIAL_STEPS: Record<number, StepConfig> = {
  1: {
    step: 1,
    targetId: 'nav-odds-btn',
    badge: 'STEP 1: ODDS & MATH',
    title: 'KNOW YOUR ODDS',
    dialogue: 'Knowledge is your sharpest weapon! Tap Odds in the header anytime to inspect symbol probabilities and archetype counter math.',
  },
  2: {
    step: 2,
    targetId: 'home-gladiator-btn',
    badge: 'STEP 2: ARMORY & GEAR',
    title: 'FORGE YOUR CHAMPION',
    dialogue: 'Tap My Gladiator & Gear to pick your archetype (Murmillo, Retiarius, Thraex) and equip armor to boost your Health!',
  },
  3: {
    step: 3,
    targetId: 'home-start-war-btn',
    badge: 'STEP 3: ENTER ARENA WAR',
    title: 'TO THE SANDS!',
    dialogue: 'The Colosseum roars for blood and glory! Tap Enter Arena War to scout your first rival opponent.',
    buttonLabel: 'SCOUT RIVALS NOW',
    action: 'navigate_target',
  },
  4: {
    step: 4,
    targetId: 'target-scout-grid',
    badge: 'STEP 4: SCOUTING RIVALS',
    title: 'CHOOSE YOUR ADVERSARY',
    dialogue: 'Scout your rival carefully! Murmillo shield counters Retiarius net, Retiarius counters Thraex, and Thraex cuts Murmillo.',
  },
  5: {
    step: 5,
    targetId: 'battle-slot-cabinet',
    badge: 'STEP 5: REELS OF DESTINY',
    title: 'SPIN FOR VICTORY',
    dialogue: 'Spin the 3 Reels of Fate! 🗡️ Swords deal damage, 🛡️ Shields block strikes, and 3 matching symbols trigger a Jackpot!',
    buttonLabel: "LET'S BATTLE!",
    action: 'complete',
  },
};

export const FortunaTutorialModal: React.FC<FortunaTutorialModalProps> = ({
  onClose,
  onStartFirstFight,
  currentViewMode = 'home',
}) => {
  const profile = loadPlayerProfile();
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = Name Prompt Modal
  const [playerNameInput, setPlayerNameInput] = useState<string>(profile.playerName || 'Imperator');

  // Apply highlight spotlight pulse effect to active target element on DOM
  useEffect(() => {
    if (currentStep === 0) return;

    const config = TUTORIAL_STEPS[currentStep];
    if (!config) return;

    // Remove previous highlights
    document.querySelectorAll('.tutorial-highlight-pulse').forEach((el) => {
      el.classList.remove('tutorial-highlight-pulse');
    });

    const targetEl = document.getElementById(config.targetId);
    if (targetEl) {
      targetEl.classList.add('tutorial-highlight-pulse');
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      if (targetEl) {
        targetEl.classList.remove('tutorial-highlight-pulse');
      }
    };
  }, [currentStep, currentViewMode]);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundFx.playClick();
    const trimmed = playerNameInput.trim() || 'Imperator';
    updatePlayerName(trimmed);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    soundFx.playClick();
    const config = TUTORIAL_STEPS[currentStep];

    if (config?.action === 'navigate_target') {
      onStartFirstFight();
      setCurrentStep(4);
    } else if (config?.action === 'complete' || currentStep >= 5) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    soundFx.playClick();
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    soundFx.playClick();
    // Remove highlights
    document.querySelectorAll('.tutorial-highlight-pulse').forEach((el) => {
      el.classList.remove('tutorial-highlight-pulse');
    });
    setTutorialCompleted(true);
    onClose();
  };

  const handleComplete = () => {
    soundFx.playClick();
    document.querySelectorAll('.tutorial-highlight-pulse').forEach((el) => {
      el.classList.remove('tutorial-highlight-pulse');
    });
    setTutorialCompleted(true);
    onClose();
  };

  // STEP 0: Compact Regal Name Input Prompt Modal
  if (currentStep === 0) {
    return (
      <div className="modal-overlay" style={{ zIndex: 150, backdropFilter: 'blur(12px)' }}>
        <div
          className="modal-content"
          style={{
            maxWidth: '440px',
            padding: '1.4rem',
            textAlign: 'center',
            border: '2px solid var(--color-gold)',
            boxShadow: '0 25px 70px rgba(0,0,0,0.98), 0 0 50px rgba(245, 158, 11, 0.4)',
            background: 'linear-gradient(180deg, rgba(14, 18, 28, 0.98) 0%, rgba(6, 8, 14, 0.98) 100%)',
            borderRadius: '24px',
            position: 'relative',
          }}
        >
          {/* Queen Fortuna Avatar Header */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.6rem' }}>
            <div className="fortuna-divine-aura" style={{ width: '120px', height: '120px' }} />
            <img
              src="./assets/Fortuna-NPC-torso.png"
              alt="Queen Fortuna"
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2.5px solid #facc15',
                filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.8))',
                position: 'relative',
                zIndex: 2,
              }}
            />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(245,158,11,0.15)', border: '1px solid var(--color-gold)', padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 900, color: '#facc15', marginBottom: '0.4rem' }}>
            <Crown size={12} />
            <span>QUEEN FORTUNA WELCOMES YOU</span>
          </div>

          <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '0.2rem 0 0.4rem 0', fontFamily: 'var(--font-serif)' }}>
            CLAIM YOUR GLADIATOR NAME
          </h2>

          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45, marginBottom: '1.1rem' }}>
            "Hail, fighter! I am Queen Fortuna—ruler of these sands. Before you step upon the arena floor, tell me: by what name shall Rome know you?"
          </p>

          <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--color-gold)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={playerNameInput}
                onChange={(e) => setPlayerNameInput(e.target.value)}
                placeholder="Enter Gladiator Name..."
                maxLength={20}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#fff',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1.5px solid var(--color-gold)',
                  borderRadius: '14px',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
                }}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary pulse-btn-gold"
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '1rem',
                borderRadius: '14px',
                marginTop: '0.2rem',
              }}
              onMouseEnter={() => soundFx.playHover()}
            >
              <Swords size={18} />
              <span>CLAIM MY NAME & ENTER ARENA</span>
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEPS 1 to 5: Sleek Floating Speech Popover Box
  const config = TUTORIAL_STEPS[currentStep] || TUTORIAL_STEPS[1];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 140,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: currentStep === 1 ? 'flex-start' : currentStep === 3 ? 'center' : 'flex-end',
        padding: '1.2rem',
      }}
    >
      {/* Floating Compact Dialogue Popover */}
      <div
        className="fortuna-popover-box"
        style={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(180deg, rgba(14, 18, 28, 0.96) 0%, rgba(6, 8, 14, 0.98) 100%)',
          border: '2px solid var(--color-gold)',
          borderRadius: '20px',
          padding: '0.85rem 1rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(245, 158, 11, 0.35)',
          animation: 'popoverPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        {/* Header Row: Fortuna Portrait + Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <img
              src="./assets/Fortuna-NPC-torso.png"
              alt="Queen Fortuna"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #facc15',
                boxShadow: '0 0 12px rgba(250, 204, 21, 0.7)',
                flexShrink: 0,
              }}
            />
            <div>
              <span className="step-tag-pill" style={{ fontSize: '0.58rem', padding: '0.1rem 0.4rem' }}>
                {config.badge}
              </span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#fff', margin: 0, fontFamily: 'var(--font-serif)' }}>
                {config.title}
              </h4>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-icon"
            style={{ width: '28px', height: '28px', padding: 0 }}
            onClick={handleSkip}
            onMouseEnter={() => soundFx.playHover()}
            title="Skip Guidance"
          >
            <X size={15} />
          </button>
        </div>

        {/* Dialogue Text */}
        <div className="dialogue-speech-box" style={{ padding: '0.65rem 0.8rem', fontSize: '0.82rem', lineHeight: 1.38 }}>
          {config.dialogue}
        </div>

        {/* Footer Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
          {/* Step Dots */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                onClick={() => {
                  soundFx.playClick();
                  setCurrentStep(s);
                }}
                className={`step-dot ${currentStep === s ? 'active' : ''}`}
                style={{ width: '8px', height: '8px' }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.45rem' }}>
            {currentStep > 1 && (
              <button
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.74rem' }}
                onClick={handlePrevStep}
                onMouseEnter={() => soundFx.playHover()}
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>
            )}

            <button
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.74rem' }}
              onClick={handleSkip}
              onMouseEnter={() => soundFx.playHover()}
            >
              <span>Skip</span>
            </button>

            <button
              className="btn btn-primary"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
              onClick={handleNextStep}
              onMouseEnter={() => soundFx.playHover()}
            >
              <span>{config.buttonLabel || 'Next'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
