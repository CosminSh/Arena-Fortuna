import React, { useState, useEffect } from 'react';
import { Gladiator, SymbolType, BattleState, TurnOutcome } from '../types/game';
import { ARCHETYPES, spinReels, resolveTurn, evaluateCombination } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { Swords, Shield, Zap, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BattleViewProps {
  playerGladiator: Gladiator;
  enemyGladiator: Gladiator;
  onFinishBattle: (state: BattleState) => void;
}

const SYMBOL_DISPLAY: Record<SymbolType, { label: string; icon: string; color: string }> = {
  sword: { label: 'Sword', icon: '🗡️', color: '#ef4444' },
  shield: { label: 'Shield', icon: '🛡️', color: '#3b82f6' },
  class: { label: 'Class Ability', icon: '⭐', color: '#f59e0b' },
  wild: { label: 'Wild', icon: '🃏', color: '#a855f7' },
};

export const BattleView: React.FC<BattleViewProps> = ({
  playerGladiator: initialPlayer,
  enemyGladiator: initialEnemy,
  onFinishBattle,
}) => {
  const [player, setPlayer] = useState<Gladiator>({ ...initialPlayer });
  const [enemy, setEnemy] = useState<Gladiator>({ ...initialEnemy });
  const [turn, setTurn] = useState<number>(1);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reels, setReels] = useState<SymbolType[]>(['sword', 'shield', 'class']);
  const [combatLogs, setCombatLogs] = useState<TurnOutcome[]>([]);
  const [canReroll, setCanReroll] = useState<boolean>(false);
  const [activeEntangledDefender, setActiveEntangledDefender] = useState<boolean>(false);
  const [activeEntangledPlayer, setActiveEntangledPlayer] = useState<boolean>(false);
  const [firstNetUsedPlayer, setFirstNetUsedPlayer] = useState<boolean>(false);
  const [firstNetUsedEnemy, setFirstNetUsedEnemy] = useState<boolean>(false);
  const [floatingDamage, setFloatingDamage] = useState<{ text: string; isPlayerTarget: boolean } | null>(null);

  const playerArch = ARCHETYPES[player.archetypeId];
  const enemyArch = ARCHETYPES[enemy.archetypeId];

  // Trigger spin and combat turn sequence
  const handleSpin = () => {
    if (isSpinning || player.currentHp <= 0 || enemy.currentHp <= 0 || turn > 8) return;

    setIsSpinning(true);
    soundFx.playSpinTick();

    // Reel spin interval animation
    let tickCount = 0;
    const spinInterval = setInterval(() => {
      setReels(spinReels());
      soundFx.playSpinTick();
      tickCount++;
      if (tickCount >= 10) {
        clearInterval(spinInterval);

        // Final roll outcome
        const finalReels = spinReels();
        setReels(finalReels);
        soundFx.playReelStop();
        setIsSpinning(false);

        // Resolve Player Turn
        executeTurnSequence(finalReels);
      }
    }, 90);
  };

  const executeTurnSequence = (finalReels: SymbolType[]) => {
    // 1. Resolve Player Turn
    const playerTurnResult = resolveTurn(
      turn,
      player,
      enemy,
      finalReels,
      activeEntangledPlayer,
      firstNetUsedEnemy
    );

    const pOutcome = playerTurnResult.outcome;
    setFirstNetUsedEnemy(playerTurnResult.updatedFirstNetUsed);

    // Apply Player turn results to Enemy HP & Player Shields
    const nextEnemyHp = Math.max(0, enemy.currentHp - pOutcome.netDamage);
    const nextPlayerShields = player.shieldCharges + pOutcome.shieldBlocked; // keep current shield absorb tracking

    setEnemy((prev) => ({ ...prev, currentHp: nextEnemyHp }));
    if (pOutcome.netDamage > 0) {
      soundFx.playHit();
      setFloatingDamage({ text: `-${pOutcome.netDamage}`, isPlayerTarget: false });
    } else if (pOutcome.shieldBlocked > 0) {
      soundFx.playShieldBlock();
    }

    if (pOutcome.combination.tier === 'jackpot') {
      soundFx.playJackpot();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }

    // Check Reroll bonus for Retiarius
    if (pOutcome.rerollGranted) {
      setCanReroll(true);
    }

    // Reset or set Entangled status on Enemy
    if (pOutcome.debuffApplied) {
      setActiveEntangledDefender(true);
    } else {
      setActiveEntangledDefender(false);
    }
    setActiveEntangledPlayer(false); // Used up entangled on player turn

    setCombatLogs((prev) => [pOutcome, ...prev]);

    // Check if Enemy defeated
    if (nextEnemyHp <= 0) {
      soundFx.playVictory();
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      setTimeout(() => finishMatch(player, { ...enemy, currentHp: 0 }, turn, pOutcome), 1500);
      return;
    }

    // 2. Resolve Enemy Counter-Turn after brief delay
    setTimeout(() => {
      const enemyReels = spinReels();
      const enemyTurnResult = resolveTurn(
        turn,
        enemy,
        { ...player, shieldCharges: nextPlayerShields },
        enemyReels,
        activeEntangledDefender,
        firstNetUsedPlayer
      );

      const eOutcome = enemyTurnResult.outcome;
      setFirstNetUsedPlayer(enemyTurnResult.updatedFirstNetUsed);

      const nextPlayerHp = Math.max(0, player.currentHp - eOutcome.netDamage);
      setPlayer((prev) => ({ ...prev, currentHp: nextPlayerHp }));

      if (eOutcome.netDamage > 0) {
        soundFx.playHit();
        setFloatingDamage({ text: `-${eOutcome.netDamage}`, isPlayerTarget: true });
      }

      if (eOutcome.debuffApplied) {
        setActiveEntangledPlayer(true);
      }

      setCombatLogs((prev) => [eOutcome, ...prev]);

      // Check if Player defeated or turn limit reached
      if (nextPlayerHp <= 0 || turn >= 8) {
        setTimeout(() => finishMatch({ ...player, currentHp: nextPlayerHp }, { ...enemy, currentHp: nextEnemyHp }, turn, eOutcome), 1500);
      } else {
        setTurn((prev) => prev + 1);
      }
    }, 1200);
  };

  const finishMatch = (finalP: Gladiator, finalE: Gladiator, finalTurn: number, lastOutcome: TurnOutcome) => {
    const isWinner = finalP.currentHp > finalE.currentHp;
    onFinishBattle({
      playerGladiator: finalP,
      enemyGladiator: finalE,
      currentTurn: finalTurn,
      isPlayerTurn: false,
      isSpinning: false,
      lockedReelIndexes: [false, false, false],
      history: combatLogs,
      winnerId: isWinner ? finalP.id : finalE.id,
      isOver: true,
      canReroll: false,
      hasUsedRerollThisTurn: false,
      matchupBonus: {
        attackerAdvantage: playerArch.favoredAgainst === enemy.archetypeId,
        defenderAdvantage: enemyArch.favoredAgainst === player.archetypeId,
        percentage: 15,
      },
    });
  };

  const handleRetiariusReroll = () => {
    if (!canReroll || isSpinning) return;
    setCanReroll(false);
    handleSpin();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Turn & Status Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 18, 26, 0.9)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid var(--color-border-gold)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Swords size={20} color="#f59e0b" />
          <strong style={{ color: '#fff', fontSize: '1rem' }}>BATTLE TURN {turn} / 8</strong>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          {playerArch.favoredAgainst === enemy.archetypeId && (
            <span style={{ color: '#10b981', fontWeight: 700 }}>⚡ TRIANGLE ADVANTAGE (+15% Damage)</span>
          )}
          {enemyArch.favoredAgainst === player.archetypeId && (
            <span style={{ color: '#ef4444', fontWeight: 700 }}>⚠️ RIVAL ADVANTAGE ({enemyArch.name} Pierce)</span>
          )}
        </div>
      </div>

      {/* Duel Arena Frame */}
      <div className="duel-arena">
        {/* Player Card */}
        <div className="card gladiator-card" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
          <img src={playerArch.portrait} alt={player.name} className="gladiator-avatar" style={{ borderColor: '#3b82f6' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{player.name}</h3>
          <span style={{ fontSize: '0.75rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: 700 }}>
            {playerArch.name} ({playerArch.subName})
          </span>

          <div className="hp-bar-outer" style={{ width: '100%' }}>
            <div
              className={`hp-bar-inner ${player.currentHp < 30 ? 'low' : ''}`}
              style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}
            />
            <span className="hp-text">{player.currentHp} / {player.maxHp} HP</span>
          </div>

          {activeEntangledPlayer && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.4rem', border: '1px solid #ef4444' }}>
              🕸️ Entangled (-30% Damage)
            </div>
          )}
        </div>

        {/* VS Badge */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-gold)', textShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}>VS</div>
        </div>

        {/* Enemy Card */}
        <div className="card gladiator-card" style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
          <img src={enemy.avatarUrl} alt={enemy.name} className="gladiator-avatar" style={{ borderColor: '#ef4444' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{enemy.name}</h3>
          <span style={{ fontSize: '0.75rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 700 }}>
            {enemyArch.name} ({enemyArch.subName})
          </span>

          <div className="hp-bar-outer" style={{ width: '100%' }}>
            <div
              className={`hp-bar-inner ${enemy.currentHp < 30 ? 'low' : ''}`}
              style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%`, background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' }}
            />
            <span className="hp-text">{enemy.currentHp} / {enemy.maxHp} HP</span>
          </div>

          {activeEntangledDefender && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.4rem', border: '1px solid #ef4444' }}>
              🕸️ Entangled (-30% Damage)
            </div>
          )}
        </div>
      </div>

      {/* Slot Machine */}
      <div className="slot-machine-container">
        <div style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em' }}>
          COMBAT SLOT REELS
        </div>

        <div className="reels-wrapper">
          {reels.map((sym, idx) => {
            const display = SYMBOL_DISPLAY[sym];
            return (
              <div key={idx} className={`reel ${isSpinning ? 'spinning' : ''}`}>
                <div className="reel-symbol">
                  <span className="reel-icon">{display.icon}</span>
                  <span className="reel-label" style={{ color: display.color }}>{display.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Spin Actions */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="spin-btn-large"
            onClick={handleSpin}
            disabled={isSpinning || player.currentHp <= 0 || enemy.currentHp <= 0}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN REELS'}
          </button>

          {canReroll && (
            <button
              className="btn btn-secondary pulse"
              onClick={handleRetiariusReroll}
              style={{ padding: '0.9rem 1.4rem', borderColor: '#a855f7', color: '#c084fc' }}
            >
              <RefreshCw size={20} />
              <span>FREE NET REROLL</span>
            </button>
          )}
        </div>
      </div>

      {/* Combat Log */}
      <div>
        <h4 style={{ fontSize: '1rem', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>COMBAT LOG</h4>
        <div className="combat-log-box">
          {combatLogs.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Spin the slot reels to initiate battle turn...</div>
          ) : (
            combatLogs.map((log, idx) => (
              <div
                key={idx}
                className={`log-entry ${log.attackerId === player.id ? 'player' : 'enemy'}`}
              >
                <strong style={{ color: log.attackerId === player.id ? '#60a5fa' : '#f87171' }}>
                  {log.attackerName}:
                </strong>{' '}
                {log.logMessage}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
