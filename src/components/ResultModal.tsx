import React from 'react';
import { BattleState } from '../types/game';
import { ARCHETYPES } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { Trophy, Skull, RefreshCw, Home, Zap, Swords, Shield, Info } from 'lucide-react';

interface ResultModalProps {
  battleState: BattleState;
  onReturnHome: () => void;
  onRematch: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ battleState, onReturnHome, onRematch }) => {
  const { playerGladiator, enemyGladiator, winnerId, history, currentTurn } = battleState;
  const isVictory = winnerId === playerGladiator.id;

  const playerArch = ARCHETYPES[playerGladiator.archetypeId];
  const enemyArch = ARCHETYPES[enemyGladiator.archetypeId];

  // Player Stats (player is attacker)
  const playerLogs = history.filter((h) => h.attackerId === playerGladiator.id);
  const playerDmgDealt = playerLogs.reduce((acc, h) => acc + h.netDamage, 0);
  const playerPierced = playerLogs.reduce((acc, h) => acc + h.piercedDamage, 0);
  const playerJackpots = playerLogs.filter((h) => h.combination.tier === 'jackpot').length;

  // Enemy Stats (enemy is attacker)
  const enemyLogs = history.filter((h) => h.attackerId === enemyGladiator.id);
  const enemyDmgDealt = enemyLogs.reduce((acc, h) => acc + h.netDamage, 0);
  const enemyPierced = enemyLogs.reduce((acc, h) => acc + h.piercedDamage, 0);
  const enemyJackpots = enemyLogs.filter((h) => h.combination.tier === 'jackpot').length;

  // Shield absorption: damage blocked by defender during opponent's attacks
  const playerShieldBlocked = enemyLogs.reduce((acc, h) => acc + h.shieldBlocked, 0);
  const enemyShieldBlocked = playerLogs.reduce((acc, h) => acc + h.shieldBlocked, 0);

  const pointsEarned = isVictory ? 150 : 50;

  // Tactical verdict explanation
  const playerHasAdvantage = playerArch.favoredAgainst === enemyGladiator.archetypeId;
  const enemyHasAdvantage = enemyArch.favoredAgainst === playerGladiator.archetypeId;

  let tacticalVerdict = '';
  if (isVictory) {
    if (playerJackpots > enemyJackpots) {
      tacticalVerdict = `Your slot luck delivered ${playerJackpots} Jackpot rolls, breaking through ${enemyGladiator.name}'s defense!`;
    } else if (playerHasAdvantage) {
      tacticalVerdict = `Your ${playerArch.name} archetype had a soft triangle advantage over ${enemyGladiator.name}'s ${enemyArch.name}.`;
    } else {
      tacticalVerdict = `Superior turn output and mitigation secured victory in ${currentTurn} turns.`;
    }
  } else {
    if (enemyJackpots > playerJackpots) {
      tacticalVerdict = `${enemyGladiator.name} rolled ${enemyJackpots} Jackpot combinations, dealing ${enemyDmgDealt} total damage!`;
    } else if (enemyHasAdvantage) {
      tacticalVerdict = `${enemyGladiator.name}'s ${enemyArch.name} archetype counter-balanced your ${playerArch.name} build (+15% triangle perk).`;
    } else {
      tacticalVerdict = `${enemyGladiator.name}'s defense absorbed ${enemyShieldBlocked} HP of damage across the battle.`;
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ borderColor: isVictory ? '#10b981' : '#ef4444', textAlign: 'center' }}>
        {/* Victory/Defeat Banner Icon */}
        <div
          style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: '50%',
            background: isVictory ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `3px solid ${isVictory ? '#10b981' : '#ef4444'}`,
            marginBottom: '0.8rem',
          }}
        >
          {isVictory ? <Trophy size={42} color="#10b981" /> : <Skull size={42} color="#ef4444" />}
        </div>

        <h2 style={{ fontSize: '2.2rem', color: isVictory ? '#10b981' : '#ef4444', marginBottom: '0.2rem' }}>
          {isVictory ? 'VICTORY IN THE ARENA!' : 'DEFEATED IN COMBAT'}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          {isVictory
            ? `${playerGladiator.name} defeated ${enemyGladiator.name} in ${currentTurn} turns!`
            : `${enemyGladiator.name} claimed victory in ${currentTurn} turns.`}
        </p>

        {/* House Points Badge */}
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--color-gold)', borderRadius: '12px', padding: '0.6rem 1.2rem', marginBottom: '1.2rem', display: 'inline-block' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 700, display: 'block' }}>
            HOUSE WAR CONTRIBUTION
          </span>
          <strong style={{ fontSize: '1.4rem', color: '#fff' }}>+{pointsEarned} WAR POINTS</strong>
        </div>

        {/* Tactical Verdict Box (Explaining WHY you won or lost!) */}
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '0.8rem', marginBottom: '1.2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
            <Info size={16} />
            <span>TACTICAL VERDICT & RECAP</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#e5e7eb' }}>{tacticalVerdict}</p>
        </div>

        {/* SIDE-BY-SIDE COMBAT PERFORMANCE COMPARISON TABLE */}
        <div style={{ background: 'rgba(10, 14, 22, 0.9)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '14px', padding: '0.8rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-gold)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
            MATCH STATS COMPARISON
          </span>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.4rem', textAlign: 'left', color: '#60a5fa' }}>YOU ({playerGladiator.name})</th>
                <th style={{ padding: '0.4rem' }}>STAT METRIC</th>
                <th style={{ padding: '0.4rem', textAlign: 'right', color: '#f87171' }}>ENEMY ({enemyGladiator.name})</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.4rem', textAlign: 'left', fontWeight: 800, color: isVictory ? '#10b981' : '#ef4444' }}>
                  {playerGladiator.currentHp} / {playerGladiator.maxHp} HP
                </td>
                <td style={{ padding: '0.4rem', color: 'var(--color-text-muted)' }}>Final HP</td>
                <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: 800, color: !isVictory ? '#10b981' : '#ef4444' }}>
                  {enemyGladiator.currentHp} / {enemyGladiator.maxHp} HP
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.4rem', textAlign: 'left', fontWeight: 800, color: '#fff' }}>{playerDmgDealt} HP</td>
                <td style={{ padding: '0.4rem', color: 'var(--color-text-muted)' }}>Damage Dealt</td>
                <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: 800, color: '#fff' }}>{enemyDmgDealt} HP</td>
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.4rem', textAlign: 'left', fontWeight: 800, color: '#3b82f6' }}>{playerShieldBlocked} HP</td>
                <td style={{ padding: '0.4rem', color: 'var(--color-text-muted)' }}>Shield Absorbed</td>
                <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: 800, color: '#3b82f6' }}>{enemyShieldBlocked} HP</td>
              </tr>

              <tr>
                <td style={{ padding: '0.4rem', textAlign: 'left', fontWeight: 800, color: '#f59e0b' }}>{playerJackpots}</td>
                <td style={{ padding: '0.4rem', color: 'var(--color-text-muted)' }}>Jackpots Rolled</td>
                <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: 800, color: '#f59e0b' }}>{enemyJackpots}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.6rem' }}
            onClick={() => {
              soundFx.playClick();
              onReturnHome();
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <Home size={18} />
            <span>RETURN TO WAR</span>
          </button>

          <button
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1.4rem' }}
            onClick={() => {
              soundFx.playClick();
              onRematch();
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <RefreshCw size={18} />
            <span>REMATCH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
