import React from 'react';
import { BattleState } from '../types/game';
import { Trophy, Skull, RefreshCw, Home, Shield, Swords, BarChart3 } from 'lucide-react';

interface ResultModalProps {
  battleState: BattleState;
  onReturnHome: () => void;
  onRematch: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ battleState, onReturnHome, onRematch }) => {
  const { playerGladiator, enemyGladiator, winnerId, history, currentTurn } = battleState;
  const isVictory = winnerId === playerGladiator.id;

  const playerLogs = history.filter((h) => h.attackerId === playerGladiator.id);
  const totalDamageDealt = playerLogs.reduce((acc, h) => acc + h.netDamage, 0);
  const totalShieldBlocked = playerLogs.reduce((acc, h) => acc + h.shieldBlocked, 0);
  const totalPiercedDamage = playerLogs.reduce((acc, h) => acc + h.piercedDamage, 0);
  const jackpotsCount = playerLogs.filter((h) => h.combination.tier === 'jackpot').length;

  const pointsEarned = isVictory ? 150 : 50;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ borderColor: isVictory ? '#10b981' : '#ef4444', textAlign: 'center' }}>
        {/* Banner Icon */}
        <div
          style={{
            display: 'inline-flex',
            padding: '1.2rem',
            borderRadius: '50%',
            background: isVictory ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `3px solid ${isVictory ? '#10b981' : '#ef4444'}`,
            marginBottom: '1rem',
          }}
        >
          {isVictory ? <Trophy size={48} color="#10b981" /> : <Skull size={48} color="#ef4444" />}
        </div>

        <h2 style={{ fontSize: '2.4rem', color: isVictory ? '#10b981' : '#ef4444', marginBottom: '0.2rem' }}>
          {isVictory ? 'VICTORY IN THE ARENA!' : 'DEFEATED IN COMBAT'}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          {isVictory
            ? `${playerGladiator.name} vanquished ${enemyGladiator.name} in ${currentTurn} turns!`
            : `${enemyGladiator.name} proved formidable. Study your archetype strategy for the next bout.`}
        </p>

        {/* House Points Badge */}
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--color-gold)', borderRadius: '12px', padding: '0.8rem', marginBottom: '1.5rem', display: 'inline-block' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 700, display: 'block' }}>
            HOUSE WAR CONTRIBUTION
          </span>
          <strong style={{ fontSize: '1.6rem', color: '#fff' }}>+{pointsEarned} WAR POINTS</strong>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.8rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Turns Fought</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{currentTurn} / 8</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.8rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Damage Dealt</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{totalDamageDealt} HP</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.8rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Shield Absorbed</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>{totalShieldBlocked} HP</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.8rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Jackpots Rolled</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{jackpotsCount}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ padding: '0.8rem 1.8rem' }} onClick={onReturnHome}>
            <Home size={18} />
            <span>RETURN TO HOUSE WAR</span>
          </button>

          <button className="btn btn-secondary" style={{ padding: '0.8rem 1.6rem' }} onClick={onRematch}>
            <RefreshCw size={18} />
            <span>REMATCH ENCOUNTER</span>
          </button>
        </div>
      </div>
    </div>
  );
};
