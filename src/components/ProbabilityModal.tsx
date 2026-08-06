import React from 'react';
import { X, BarChart2, Zap, Layers } from 'lucide-react';
import { soundFx } from '../engine/audioEngine';

interface ProbabilityModalProps {
  onClose: () => void;
}

export const ProbabilityModal: React.FC<ProbabilityModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={() => { soundFx.playClick(); onClose(); }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BarChart2 size={28} color="#f59e0b" />
            <div>
              <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>MATH & PROBABILITY SPECIFICATION</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Arena Reels Combat Resolution & Symbol Matrix</span>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem' }}>
          {/* Section 1: Reel Symbol Distribution */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} />
              <span>1. Reel Symbol Weights & Single-Reel Odds</span>
            </h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              Each of the 3 combat reels uses a weighted probability distribution. Wild symbols dynamically morph to complete the highest-tier matching combination.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--color-gold)' }}>
                  <th style={{ padding: '0.6rem' }}>Symbol</th>
                  <th style={{ padding: '0.6rem' }}>Combat Function</th>
                  <th style={{ padding: '0.6rem' }}>Weight</th>
                  <th style={{ padding: '0.6rem' }}>Single Reel %</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.6rem' }}>🗡️ <strong>Sword</strong></td>
                  <td style={{ padding: '0.6rem' }}>Direct Damage Output</td>
                  <td style={{ padding: '0.6rem' }}>35</td>
                  <td style={{ padding: '0.6rem', color: '#10b981', fontWeight: 700 }}>35.0%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.6rem' }}>🛡️ <strong>Shield</strong></td>
                  <td style={{ padding: '0.6rem' }}>Mitigation & Absorption</td>
                  <td style={{ padding: '0.6rem' }}>30</td>
                  <td style={{ padding: '0.6rem', color: '#10b981', fontWeight: 700 }}>30.0%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.6rem' }}>⭐ <strong>Class Symbol</strong></td>
                  <td style={{ padding: '0.6rem' }}>Archetype Ability Trigger</td>
                  <td style={{ padding: '0.6rem' }}>25</td>
                  <td style={{ padding: '0.6rem', color: '#10b981', fontWeight: 700 }}>25.0%</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.6rem' }}>🃏 <strong>Wild</strong></td>
                  <td style={{ padding: '0.6rem' }}>Substitutes into Best Combination</td>
                  <td style={{ padding: '0.6rem' }}>10</td>
                  <td style={{ padding: '0.6rem', color: '#c084fc', fontWeight: 700 }}>10.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: 3-Reel Combination Probability Matrix */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={18} />
              <span>2. 3-Reel Outcome Probability Matrix</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '0.8rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 700 }}>3-OF-A-KIND (JACKPOT)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0.2rem 0' }}>19.60%</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>High damage, shield reflect, or maximum ability output.</span>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '0.8rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#60a5fa', fontWeight: 700 }}>2-OF-A-KIND (STANDARD)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0.2rem 0' }}>64.65%</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Common successful outcome; standard damage or shield.</span>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '0.8rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#f87171', fontWeight: 700 }}>NO MATCH (FUMBLE)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0.2rem 0' }}>15.75%</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Weak roll; low minimal damage output (8–10 HP).</span>
              </div>
            </div>
            <div style={{ marginTop: '0.8rem', fontSize: '0.78rem', color: 'var(--color-gold)', fontStyle: 'italic' }}>
              💡 Verify these probabilities empirically by running <code>npm run simulate</code> in the terminal.
            </div>
          </div>

          {/* Section 3: Soft Matchup Triangle */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} />
              <span>3. Soft Archetype Triangle Balance</span>
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
              The archetype matchup triangle provides a <strong>15% effective multiplier</strong> or damage mitigation perk without creating automatic victories:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', color: 'var(--color-text-main)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <li><strong>Murmillo beats Retiarius</strong>: Large shield mitigates trident pressure & resists 50% of the first Net disruption effect.</li>
              <li><strong>Retiarius beats Thraex</strong>: Web disruption (-30% debuff) locks down high-tempo burst momentum.</li>
              <li><strong>Thraex beats Murmillo</strong>: Hooked blade (Sica) bypasses 25%–40% of Murmillo's shield block.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

