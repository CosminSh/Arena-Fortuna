import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Swords, BarChart2, Shield, Sparkles, Crown, HelpCircle } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';
import { setTutorialCompleted } from '../engine/storageEngine';

interface FortunaTutorialModalProps {
  onClose: () => void;
  onStartFirstFight: () => void;
  onHighlightOdds?: () => void;
}

export const FortunaTutorialModal: React.FC<FortunaTutorialModalProps> = ({
  onClose,
  onStartFirstFight,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  const handleNext = () => {
    soundFx.playClick();
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleCompleteAndFight();
    }
  };

  const handlePrev = () => {
    soundFx.playClick();
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    soundFx.playClick();
    setTutorialCompleted(true);
    onClose();
  };

  const handleCompleteAndFight = () => {
    soundFx.playClick();
    setTutorialCompleted(true);
    onClose();
    onStartFirstFight();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 120, backdropFilter: 'blur(16px)' }}>
      <div
        className="modal-content fortuna-modal-card"
        style={{
          maxWidth: '680px',
          padding: '0',
          overflow: 'hidden',
          border: '2px solid var(--color-gold)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(245, 158, 11, 0.35)',
          background: 'linear-gradient(180deg, rgba(14, 18, 28, 0.98) 0%, rgba(6, 8, 14, 0.98) 100%)',
          borderRadius: '26px',
        }}
      >
        {/* Top Header Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.4rem',
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.18) 0%, rgba(14, 18, 28, 0.4) 100%)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Crown size={22} color="#facc15" style={{ filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))' }} />
            <div>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  color: '#fff',
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1.1,
                  letterSpacing: '0.04em',
                }}
              >
                QUEEN FORTUNA'S GUIDANCE
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                Step {currentStep} of {totalSteps} — Arena Regent & Goddess of Fate
              </span>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px', padding: 0 }}
            onClick={handleSkip}
            onMouseEnter={() => soundFx.playHover()}
            title="Close Tutorial"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Main Content (2-Column Grid: Fortuna Portrait Left + Interactive Card Right) */}
        <div className="fortuna-dialogue-grid">
          {/* Left Column: Queen Fortuna NPC Visual Showcase */}
          <div className="fortuna-portrait-container">
            <div className="fortuna-divine-aura" />
            <img
              src={currentStep === 1 ? './assets/Fortuna-NPC-full-body.png' : './assets/Fortuna-NPC-torso.png'}
              alt="Queen Fortuna"
              className="fortuna-npc-img"
            />
            <div className="fortuna-badge-tag">
              <Sparkles size={13} color="#facc15" />
              <span>QUEEN FORTUNA</span>
            </div>
          </div>

          {/* Right Column: Step Dialogue & Visual Demonstrations */}
          <div className="fortuna-content-pane">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="step-pane-content">
                <div className="step-tag-pill">GREETINGS WARRIOR</div>
                <h2 className="step-title">HAIL, FIGHTER OF INVICTA!</h2>
                <div className="dialogue-speech-box">
                  <p>
                    "I am <strong>Queen Fortuna</strong>—organizer of every arena war, ruler of these sands, and goddess of destiny!
                  </p>
                  <p style={{ marginTop: '0.6rem' }}>
                    Though thousands fight for my favor, I personally welcome every new combatant worthy enough to hold steel. Step forward into glory!"
                  </p>
                </div>
                <div className="step-perk-box">
                  <Crown size={18} color="#facc15" />
                  <span>"May fortune favor your blade on the sands of Rome!"</span>
                </div>
              </div>
            )}

            {/* Step 2: Odds & Math */}
            {currentStep === 2 && (
              <div className="step-pane-content">
                <div className="step-tag-pill">STRATEGY & ODDS</div>
                <h2 className="step-title">KNOW YOUR ODDS BEFORE YOU BLEED</h2>
                <div className="dialogue-speech-box">
                  <p>
                    "A true champion fights with mind as well as blade! In the top navigation bar, tap the <strong>'Odds'</strong> button at any time.
                  </p>
                  <p style={{ marginTop: '0.5rem' }}>
                    There you can inspect exact reel probabilities, symbol payouts, and our soft archetype counter triangle."
                  </p>
                </div>

                {/* Simulated Header Button Visual */}
                <div className="odds-demo-callout">
                  <span className="demo-label">CLICK THIS BUTTON IN THE HEADER ANYTIME:</span>
                  <div className="odds-button-mock pulse-glow">
                    <BarChart2 size={16} color="#f59e0b" />
                    <span>Odds</span>
                    <Sparkles size={13} color="#facc15" />
                  </div>
                  <div className="odds-quick-stats">
                    <span>🗡️ 35% Sword</span>
                    <span>🛡️ 30% Shield</span>
                    <span>⭐ 25% Class</span>
                    <span>🃏 10% Wild</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Armory & Archetypes */}
            {currentStep === 3 && (
              <div className="step-pane-content">
                <div className="step-tag-pill">ARMORY & GEAR</div>
                <h2 className="step-title">FORGE YOUR COMBAT IDENTITIY</h2>
                <div className="dialogue-speech-box">
                  <p>
                    "Visit <strong>'MY GLADIATOR & GEAR'</strong> to select your archetype and equip armor.
                  </p>
                  <p style={{ marginTop: '0.5rem' }}>
                    Choose between <strong>Murmillo</strong> (High Defense), <strong>Retiarius</strong> (Disruptor), or <strong>Thraex</strong> (Burst Damage). Equipping helmets and armor adds <strong>+HP</strong> directly to your fighter!"
                  </p>
                </div>

                <div className="archetype-triad-preview">
                  <div className="triad-card">
                    <span className="triad-icon">🛡️</span>
                    <span className="triad-name">Murmillo</span>
                    <span className="triad-desc">Beats Net</span>
                  </div>
                  <div className="triad-card">
                    <span className="triad-icon">🔱</span>
                    <span className="triad-name">Retiarius</span>
                    <span className="triad-desc">Beats Burst</span>
                  </div>
                  <div className="triad-card">
                    <span className="triad-icon">🗡️</span>
                    <span className="triad-name">Thraex</span>
                    <span className="triad-desc">Beats Shield</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Reel Mechanics */}
            {currentStep === 4 && (
              <div className="step-pane-content">
                <div className="step-tag-pill">COMBAT RESOLUTION</div>
                <h2 className="step-title">SPIN THE REELS OF DESTINY</h2>
                <div className="dialogue-speech-box">
                  <p>
                    "Combat is resolved by spinning 3 Reels of Fate!
                  </p>
                  <p style={{ marginTop: '0.4rem' }}>
                    Each turn, spin to strike damage, gain shield charges, or unleash your Class Special ability. Align 3 of a kind for a devastating <strong>Jackpot</strong>!"
                  </p>
                </div>

                <div className="reels-symbols-preview">
                  <div className="sym-preview-item">
                    <img src="./assets/symbol_sword.png" alt="Sword" className="sym-img" />
                    <span><strong>Sword</strong><br />Direct HP Damage</span>
                  </div>
                  <div className="sym-preview-item">
                    <img src="./assets/symbol_shield.png" alt="Shield" className="sym-img" />
                    <span><strong>Shield</strong><br />Block & Mitigate</span>
                  </div>
                  <div className="sym-preview-item">
                    <img src="./assets/symbol_class.png" alt="Class" className="sym-img" />
                    <span><strong>Class</strong><br />Special Ability</span>
                  </div>
                  <div className="sym-preview-item">
                    <img src="./assets/symbol_wild.png" alt="Wild" className="sym-img" />
                    <span><strong>Wild</strong><br />Morph Best Match</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: First Battle */}
            {currentStep === 5 && (
              <div className="step-pane-content">
                <div className="step-tag-pill highlight-gold">READY FOR GLORY</div>
                <h2 className="step-title">CLAIM YOUR FIRST VICTORY!</h2>
                <div className="dialogue-speech-box">
                  <p>
                    "The roar of the Colosseum awaits you! Your first rival is ready in the scouting grounds.
                  </p>
                  <p style={{ marginTop: '0.5rem' }}>
                    Step to the sands, spin the reels of fate, and let your name resound across Rome!"
                  </p>
                </div>

                <div className="first-fight-cta-container">
                  <button
                    className="btn btn-primary pulse-btn-gold"
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.2rem',
                      fontSize: '1.1rem',
                      borderRadius: '16px',
                    }}
                    onClick={handleCompleteAndFight}
                    onMouseEnter={() => soundFx.playHover()}
                  >
                    <Swords size={22} />
                    <span>STEP INTO THE ARENA NOW</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.4rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Step Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                onClick={() => {
                  soundFx.playClick();
                  setCurrentStep(idx + 1);
                }}
                className={`step-dot ${currentStep === idx + 1 ? 'active' : ''}`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {currentStep > 1 && (
              <button
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                onClick={handlePrev}
                onMouseEnter={() => soundFx.playHover()}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            )}

            <button
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
              onClick={handleSkip}
              onMouseEnter={() => soundFx.playHover()}
            >
              <span>Skip</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                className="btn btn-primary"
                style={{ padding: '0.45rem 1.1rem', fontSize: '0.88rem' }}
                onClick={handleNext}
                onMouseEnter={() => soundFx.playHover()}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ padding: '0.45rem 1.1rem', fontSize: '0.88rem' }}
                onClick={handleCompleteAndFight}
                onMouseEnter={() => soundFx.playHover()}
              >
                <span>To Battle!</span>
                <Swords size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
