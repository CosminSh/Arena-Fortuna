import React, { useState } from 'react';
import { Gladiator, SymbolType, BattleState, TurnOutcome } from '../types/game';
import { ARCHETYPES, spinReels, resolveTurn } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { triggerGladiatorArenaSparks } from '../engine/arenaParticles';
import { Swords, Shield, RefreshCw, Zap, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface BattleViewProps {
  playerGladiator: Gladiator;
  enemyGladiator: Gladiator;
  onFinishBattle: (state: BattleState) => void;
}

type TurnPhase = 'player_ready' | 'player_spinning' | 'enemy_spinning';

const SYMBOL_DISPLAY: Record<SymbolType, { label: string; icon: string; color: string }> = {
  sword: { label: 'Sword', icon: '🗡️', color: '#ef4444' },
  shield: { label: 'Shield', icon: '🛡️', color: '#3b82f6' },
  class: { label: 'Ability', icon: '⭐', color: '#f59e0b' },
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
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('player_ready');

  // Reels state
  const [reels, setReels] = useState<SymbolType[]>(['sword', 'shield', 'class']);
  const [spinningReelIndex, setSpinningReelIndex] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const [combatLogs, setCombatLogs] = useState<TurnOutcome[]>([]);
  const [canReroll, setCanReroll] = useState<boolean>(false);
  const [activeEntangledDefender, setActiveEntangledDefender] = useState<boolean>(false);
  const [activeEntangledPlayer, setActiveEntangledPlayer] = useState<boolean>(false);
  const [firstNetUsedPlayer, setFirstNetUsedPlayer] = useState<boolean>(false);
  const [firstNetUsedEnemy, setFirstNetUsedEnemy] = useState<boolean>(false);

  // FX States
  const [floatingDamage, setFloatingDamage] = useState<{ text: string; isEnemy: boolean } | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showLogDrawer, setShowLogDrawer] = useState<boolean>(false);

  const playerArch = ARCHETYPES[player.archetypeId];
  const enemyArch = ARCHETYPES[enemy.archetypeId];

  // 1. PLAYER SPIN SEQUENCE
  const handlePlayerSpin = () => {
    if (turnPhase !== 'player_ready' || player.currentHp <= 0 || enemy.currentHp <= 0 || turn > 8) return;

    setTurnPhase('player_spinning');
    setSpinningReelIndex([true, true, true]);
    setFloatingDamage(null);

    const finalPlayerReels = spinReels();

    const flickerInterval = setInterval(() => {
      setReels(spinReels());
      soundFx.playSpinTick();
    }, 70);

    setTimeout(() => {
      soundFx.playReelStop();
      setSpinningReelIndex(([_, r2, r3]) => [false, r2, r3]);
    }, 600);

    setTimeout(() => {
      soundFx.playReelStop();
      setSpinningReelIndex(([r1, _, r3]) => [r1, false, r3]);
    }, 1100);

    setTimeout(() => {
      clearInterval(flickerInterval);
      setReels(finalPlayerReels);
      setSpinningReelIndex([false, false, false]);
      soundFx.playReelStop();

      // Resolve Player Action
      executePlayerOutcome(finalPlayerReels);
    }, 1600);
  };

  const executePlayerOutcome = (finalReels: SymbolType[]) => {
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

    const nextEnemyHp = Math.max(0, enemy.currentHp - pOutcome.netDamage);
    setEnemy((prev) => ({ ...prev, currentHp: nextEnemyHp }));

    if (pOutcome.netDamage > 0) {
      soundFx.playHit();
      setFloatingDamage({ text: `-${pOutcome.netDamage}`, isEnemy: true });
      triggerScreenShake();
    } else if (pOutcome.shieldBlocked > 0) {
      soundFx.playShieldBlock();
    }

    if (pOutcome.combination.tier === 'jackpot') {
      soundFx.playJackpot();
      triggerGladiatorArenaSparks();
    }

    if (pOutcome.rerollGranted) setCanReroll(true);
    if (pOutcome.debuffApplied) setActiveEntangledDefender(true);
    else setActiveEntangledDefender(false);
    setActiveEntangledPlayer(false);

    setCombatLogs((prev) => [pOutcome, ...prev]);

    if (nextEnemyHp <= 0) {
      soundFx.playVictory();
      triggerGladiatorArenaSparks();
      setTimeout(() => finishMatch(player, { ...enemy, currentHp: 0 }, turn, pOutcome), 1400);
      return;
    }

    // Trigger Enemy Counter-Turn Spin Sequence after brief pause
    setTimeout(() => {
      startEnemySpinSequence(nextEnemyHp, pOutcome);
    }, 1000);
  };

  // 2. ENEMY SPIN SEQUENCE (Player watches enemy roll!)
  const startEnemySpinSequence = (currentEnemyHp: number, pOutcome: TurnOutcome) => {
    setTurnPhase('enemy_spinning');
    setSpinningReelIndex([true, true, true]);
    setFloatingDamage(null);

    const finalEnemyReels = spinReels();

    const enemyFlicker = setInterval(() => {
      setReels(spinReels());
      soundFx.playSpinTick();
    }, 70);

    setTimeout(() => {
      soundFx.playReelStop();
      setSpinningReelIndex(([_, r2, r3]) => [false, r2, r3]);
    }, 600);

    setTimeout(() => {
      soundFx.playReelStop();
      setSpinningReelIndex(([r1, _, r3]) => [r1, false, r3]);
    }, 1100);

    setTimeout(() => {
      clearInterval(enemyFlicker);
      setReels(finalEnemyReels);
      setSpinningReelIndex([false, false, false]);
      soundFx.playReelStop();

      // Resolve Enemy Action
      executeEnemyOutcome(finalEnemyReels, currentEnemyHp);
    }, 1600);
  };

  const executeEnemyOutcome = (finalEnemyReels: SymbolType[], currentEnemyHp: number) => {
    const enemyTurnResult = resolveTurn(
      turn,
      enemy,
      player,
      finalEnemyReels,
      activeEntangledDefender,
      firstNetUsedPlayer
    );

    const eOutcome = enemyTurnResult.outcome;
    setFirstNetUsedPlayer(enemyTurnResult.updatedFirstNetUsed);

    const nextPlayerHp = Math.max(0, player.currentHp - eOutcome.netDamage);
    setPlayer((prev) => ({ ...prev, currentHp: nextPlayerHp }));

    if (eOutcome.netDamage > 0) {
      soundFx.playHit();
      setFloatingDamage({ text: `-${eOutcome.netDamage}`, isEnemy: false });
      triggerScreenShake();
    } else if (eOutcome.shieldBlocked > 0) {
      soundFx.playShieldBlock();
    }

    if (eOutcome.debuffApplied) setActiveEntangledPlayer(true);
    setCombatLogs((prev) => [eOutcome, ...prev]);

    if (nextPlayerHp <= 0 || turn >= 8) {
      setTimeout(() => finishMatch({ ...player, currentHp: nextPlayerHp }, { ...enemy, currentHp: currentEnemyHp }, turn, eOutcome), 1400);
    } else {
      setTurn((prev) => prev + 1);
      setTurnPhase('player_ready');
    }
  };

  const triggerScreenShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
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

  const isEnemyTurn = turnPhase === 'enemy_spinning';

  return (
    <div
      className={isShaking ? 'shake' : ''}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Floating Damage Text */}
      {floatingDamage && (
        <div className="floating-dmg" style={{ color: floatingDamage.isEnemy ? '#ef4444' : '#60a5fa' }}>
          {floatingDamage.text}
        </div>
      )}

      {/* Top Turn & Active Fighter Status Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: isEnemyTurn ? 'rgba(239, 68, 68, 0.25)' : 'rgba(12, 16, 24, 0.85)',
          padding: '0.3rem 0.9rem',
          borderRadius: '14px',
          border: `1px solid ${isEnemyTurn ? '#ef4444' : 'var(--color-border-gold)'}`,
          fontSize: '0.78rem',
          fontWeight: 800,
          color: isEnemyTurn ? '#f87171' : '#fff',
        }}
      >
        {isEnemyTurn ? <AlertTriangle size={14} color="#ef4444" /> : <Swords size={14} color="#f59e0b" />}
        <span>{isEnemyTurn ? `RIVAL ATTACK ROLLING (TURN ${turn})` : `YOUR TURN (TURN ${turn} / 8)`}</span>
      </div>

      {/* Duel Arena Header */}
      <div className="duel-compact-arena">
        {/* Player Fighter */}
        <div className={`fighter-card player-side ${!isEnemyTurn ? 'pulse' : ''}`}>
          <img src={playerArch.portrait} alt={player.name} className="fighter-avatar" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
            <div style={{ fontSize: '0.65rem', color: '#60a5fa', fontWeight: 700 }}>{playerArch.name}</div>
            <div className="hp-track">
              <div className="hp-fill" style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }} />
              <span className="hp-val">{player.currentHp} HP</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', fontWeight: 900, color: isEnemyTurn ? '#ef4444' : 'var(--color-gold)' }}>VS</div>

        {/* Enemy Fighter */}
        <div className={`fighter-card enemy-side ${isEnemyTurn ? 'pulse' : ''}`}>
          <img src={enemy.avatarUrl} alt={enemy.name} className="fighter-avatar" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{enemy.name}</div>
            <div style={{ fontSize: '0.65rem', color: '#f87171', fontWeight: 700 }}>{enemyArch.name}</div>
            <div className="hp-track">
              <div className="hp-fill enemy" style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }} />
              <span className="hp-val">{enemy.currentHp} HP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Centerpiece 3D Casino Slot Machine Frame (Dynamically themes based on player/enemy turn!) */}
      <div
        className="slot-frame"
        style={{
          borderColor: isEnemyTurn ? '#ef4444' : 'var(--color-gold)',
          boxShadow: isEnemyTurn ? '0 0 40px rgba(239, 68, 68, 0.4), inset 0 0 25px rgba(0,0,0,0.9)' : '0 0 35px rgba(245, 158, 11, 0.35), inset 0 0 25px rgba(0,0,0,0.9)',
        }}
      >
        <div style={{ fontSize: '0.78rem', fontWeight: 900, color: isEnemyTurn ? '#f87171' : 'var(--color-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {isEnemyTurn ? `⚠️ ${enemy.name.toUpperCase()}'S ATTACK REELS` : 'YOUR COMBAT REELS'}
        </div>

        {/* 3 Reel Slots Container */}
        <div className="slot-reels-container">
          {reels.map((sym, idx) => {
            const display = SYMBOL_DISPLAY[sym];
            const isReelSpinning = spinningReelIndex[idx];
            return (
              <div
                key={idx}
                className={`slot-reel ${isReelSpinning ? 'active-spin' : ''}`}
                style={{
                  borderColor: isEnemyTurn ? 'rgba(239, 68, 68, 0.6)' : 'rgba(245, 158, 11, 0.6)',
                }}
              >
                <div className="slot-symbol-content">
                  <span className="slot-symbol-icon">{display.icon}</span>
                  <span className="slot-symbol-tag" style={{ color: display.color }}>{display.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button Strip */}
        <div style={{ display: 'flex', gap: '0.6rem', width: '100%', justifyContent: 'center' }}>
          <button
            className="spin-cta-button"
            style={{
              background: isEnemyTurn
                ? 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            }}
            onClick={handlePlayerSpin}
            disabled={turnPhase !== 'player_ready' || player.currentHp <= 0 || enemy.currentHp <= 0}
          >
            {turnPhase === 'player_spinning'
              ? 'SPINNING...'
              : isEnemyTurn
              ? 'ENEMY ROLLING...'
              : 'SPIN REELS'}
          </button>

          {canReroll && !isEnemyTurn && (
            <button
              className="btn btn-secondary"
              onClick={handlePlayerSpin}
              style={{ padding: '0.6rem 0.9rem', borderColor: '#a855f7', color: '#c084fc' }}
            >
              <RefreshCw size={16} />
              <span>REROLL</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Log Strip */}
      <div style={{ width: '100%', maxWidth: '580px', background: 'rgba(12, 16, 24, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '0.4rem 0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowLogDrawer(!showLogDrawer)}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-gold)' }}>
            {combatLogs[0] ? `LAST ROLL: ${combatLogs[0].logMessage}` : 'Tap Spin to start battle action...'}
          </span>
          {showLogDrawer ? <ChevronDown size={16} color="var(--color-gold)" /> : <ChevronUp size={16} color="var(--color-gold)" />}
        </div>

        {showLogDrawer && (
          <div style={{ marginTop: '0.4rem', maxHeight: '90px', overflowY: 'auto', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.4rem' }}>
            {combatLogs.map((l, i) => (
              <div key={i} style={{ color: l.attackerId === player.id ? '#60a5fa' : '#f87171' }}>
                <strong>{l.attackerName}:</strong> {l.logMessage}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
