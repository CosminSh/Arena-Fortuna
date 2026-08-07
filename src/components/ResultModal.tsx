import React, { useEffect, useState } from 'react';
import { BattleState } from '../types/game';
import { ARCHETYPES } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { ResultParticles } from './ResultParticles';
import { recordBattleOutcome } from '../engine/storageEngine';
import { Trophy, Skull, RefreshCw, Home, Info, Sparkles } from 'lucide-react';

interface ResultModalProps {
  battleState: BattleState;
  onReturnHome: () => void;
  onRematch: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ battleState, onReturnHome, onRematch }) => {
  const { playerGladiator, enemyGladiator, winnerId, history, currentTurn } = battleState;
  const isVictory = winnerId === playerGladiator.id;

  const [recordedResult, setRecordedResult] = useState<{
    earnedExp: number;
    earnedPoints: number;
    leveledUp: boolean;
    level: number;
  } | null>(null);

  useEffect(() => {
    const outcome = recordBattleOutcome(isVictory);
    setRecordedResult({
      earnedExp: outcome.earnedExp,
      earnedPoints: outcome.earnedPoints,
      leveledUp: outcome.leveledUp,
      level: outcome.updatedProfile.level,
    });
  }, [isVictory]);

  const playerArch = ARCHETYPES[playerGladiator.archetypeId];
  const enemyArch = ARCHETYPES[enemyGladiator.archetypeId];

  // Player Stats (player is attacker)
  const playerLogs = history.filter((h) => h.attackerId === playerGladiator.id);
  const playerDmgDealt = playerLogs.reduce((acc, h) => acc + h.netDamage, 0);
  const playerJackpots = playerLogs.filter((h) => h.combination.tier === 'jackpot').length;

  // Enemy Stats (enemy is attacker)
  const enemyLogs = history.filter((h) => h.attackerId === enemyGladiator.id);
  const enemyDmgDealt = enemyLogs.reduce((acc, h) => acc + h.netDamage, 0);
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
      tacticalVerdict = `${playerJackpots} Jackpot rolls broke through ${enemyGladiator.name}'s defense!`;
    } else if (playerHasAdvantage) {
      tacticalVerdict = `${playerArch.name} held triangle perk against ${enemyGladiator.name}'s ${enemyArch.name}.`;
    } else {
      tacticalVerdict = `Superior turn output secured victory in ${currentTurn} turns.`;
    }
  } else {
    if (enemyJackpots > playerJackpots) {
      tacticalVerdict = `${enemyGladiator.name} rolled ${enemyJackpots} Jackpots (${enemyDmgDealt} total damage).`;
    } else if (enemyHasAdvantage) {
      tacticalVerdict = `${enemyGladiator.name}'s ${enemyArch.name} counter-balanced your build (+15% perk).`;
    } else {
      tacticalVerdict = `${enemyGladiator.name}'s defense absorbed ${enemyShieldBlocked} HP of damage.`;
    }
  }

  return (
    <div className="modal-overlay result-modal-overlay">
      <div className={`modal-content result-modal-content ${isVictory ? 'victory-theme' : 'defeat-theme'}`}>
        {/* Victory/Defeat Animated Canvas VFX */}
        <ResultParticles isVictory={isVictory} />

        {/* Victory/Defeat Banner Icon */}
        <div className={`result-banner-icon ${isVictory ? 'victory-icon-glow' : 'defeat-icon-glow'}`}>
          {isVictory ? <Trophy size={32} color="#10b981" /> : <Skull size={32} color="#ef4444" />}
        </div>

        <h2 className="result-title">
          {isVictory ? 'VICTORY IN ARENA!' : 'DEFEATED IN COMBAT'}
        </h2>

        <p className="result-subtitle">
          {isVictory
            ? `${playerGladiator.name} defeated ${enemyGladiator.name} (${currentTurn} turns)`
            : `${enemyGladiator.name} won in ${currentTurn} turns`}
        </p>

        {/* House Points & EXP Badge */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.6rem', zIndex: 2 }}>
          <div className="result-war-badge" style={{ marginBottom: 0 }}>
            <span className="badge-label">HOUSE WAR:</span>
            <strong className="badge-val">+{pointsEarned} WAR PTS</strong>
          </div>

          <div className="result-war-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: '#3b82f6', marginBottom: 0 }}>
            <span className="badge-label" style={{ color: '#60a5fa' }}>EXP:</span>
            <strong className="badge-val" style={{ color: '#60a5fa' }}>+{recordedResult?.earnedExp || (isVictory ? 120 : 40)} EXP</strong>
          </div>

          {recordedResult?.leveledUp && (
            <div className="result-war-badge" style={{ background: 'rgba(250, 204, 21, 0.25)', borderColor: '#facc15', marginBottom: 0, animation: 'symbolPulse 1s infinite alternate' }}>
              <Sparkles size={12} color="#facc15" />
              <strong className="badge-val" style={{ color: '#facc15', fontSize: '0.85rem' }}>LEVEL UP! LVL {recordedResult.level}</strong>
            </div>
          )}
        </div>

        {/* Tactical Verdict Box */}
        <div className="result-verdict-box">
          <div className="verdict-header">
            <Info size={14} />
            <span>TACTICAL RECAP</span>
          </div>
          <p className="verdict-text">{tacticalVerdict}</p>
        </div>

        {/* MATCH STATS COMPARISON TABLE */}
        <div className="result-table-box">
          <div className="table-header-title">MATCH STATS COMPARISON</div>
          <table className="result-table">
            <thead>
              <tr>
                <th className="th-player">YOU ({playerGladiator.name})</th>
                <th className="th-metric">METRIC</th>
                <th className="th-enemy">ENEMY ({enemyGladiator.name})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`td-player ${isVictory ? 'text-green' : 'text-red'}`}>
                  {playerGladiator.currentHp}/{playerGladiator.maxHp} HP
                </td>
                <td className="td-metric">Final HP</td>
                <td className={`td-enemy ${!isVictory ? 'text-green' : 'text-red'}`}>
                  {enemyGladiator.currentHp}/{enemyGladiator.maxHp} HP
                </td>
              </tr>
              <tr>
                <td className="td-player text-white">{playerDmgDealt} HP</td>
                <td className="td-metric">Damage</td>
                <td className="td-enemy text-white">{enemyDmgDealt} HP</td>
              </tr>
              <tr>
                <td className="td-player text-blue">{playerShieldBlocked} HP</td>
                <td className="td-metric">Shield</td>
                <td className="td-enemy text-blue">{enemyShieldBlocked} HP</td>
              </tr>
              <tr>
                <td className="td-player text-gold">{playerJackpots}</td>
                <td className="td-metric">Jackpots</td>
                <td className="td-enemy text-gold">{enemyJackpots}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons Row */}
        <div className="result-actions-row">
          <button
            className="btn btn-primary result-btn"
            onClick={() => {
              soundFx.playClick();
              onReturnHome();
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <Home size={16} />
            <span>RETURN TO WAR</span>
          </button>

          <button
            className="btn btn-secondary result-btn"
            onClick={() => {
              soundFx.playClick();
              onRematch();
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <RefreshCw size={16} />
            <span>REMATCH</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;


