import React, { useState } from 'react';
import { Gladiator, SymbolType, BattleState, TurnOutcome } from '../types/game';
import { ARCHETYPES, spinReels, resolveTurn } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { triggerGladiatorArenaSparks } from '../engine/arenaParticles';
import { Swords, Shield, RefreshCw, Zap, ChevronDown, ChevronUp, AlertTriangle, Bot, Info, Flame, HelpCircle, X } from 'lucide-react';

interface BattleViewProps {
  playerGladiator: Gladiator;
  enemyGladiator: Gladiator;
  onFinishBattle: (state: BattleState) => void;
}

type TurnPhase = 'player_ready' | 'player_spinning' | 'enemy_spinning';

const SYMBOL_DISPLAY: Record<SymbolType, { label: string; icon: string; image: string; color: string }> = {
  sword: { label: 'Sword', icon: '🗡️', image: './assets/symbol_sword.png', color: '#ef4444' },
  shield: { label: 'Shield', icon: '🛡️', image: './assets/symbol_shield.png', color: '#3b82f6' },
  class: { label: 'Ability', icon: '⭐', image: './assets/symbol_class.png', color: '#f59e0b' },
  wild: { label: 'Wild', icon: '🃏', image: './assets/symbol_wild.png', color: '#a855f7' },
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
  const [isAutoBattle, setIsAutoBattle] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);

  const [reels, setReels] = useState<SymbolType[]>(['sword', 'shield', 'class']);
  const [spinningReelIndex, setSpinningReelIndex] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const [combatLogs, setCombatLogs] = useState<TurnOutcome[]>([]);
  const [canReroll, setCanReroll] = useState<boolean>(false);
  const [activeEntangledDefender, setActiveEntangledDefender] = useState<boolean>(false);
  const [activeEntangledPlayer, setActiveEntangledPlayer] = useState<boolean>(false);
  const [firstNetUsedPlayer, setFirstNetUsedPlayer] = useState<boolean>(false);
  const [firstNetUsedEnemy, setFirstNetUsedEnemy] = useState<boolean>(false);

  // FX & UI States
  const [floatingDamage, setFloatingDamage] = useState<{ text: string; iconImg?: string; isEnemy: boolean } | null>(null);
  const [screenFlash, setScreenFlash] = useState<'gold' | 'red' | null>(null);
  const [abilityBanner, setAbilityBanner] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showLogDrawer, setShowLogDrawer] = useState<boolean>(false);
  const [showPaytableModal, setShowPaytableModal] = useState<boolean>(false);

  const playerArch = ARCHETYPES[player.archetypeId];
  const enemyArch = ARCHETYPES[enemy.archetypeId];

  // Auto Battle spectator mode loop
  React.useEffect(() => {
    if (!isAutoBattle) return;

    let autoTimer: number | undefined;
    if (turnPhase === 'player_ready' && player.currentHp > 0 && enemy.currentHp > 0 && turn <= 8) {
      autoTimer = window.setTimeout(() => {
        handlePlayerSpin();
      }, 700);
    }
    return () => {
      if (autoTimer) clearTimeout(autoTimer);
    };
  }, [isAutoBattle, turnPhase, player.currentHp, enemy.currentHp, turn]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        if (turnPhase === 'player_ready' && player.currentHp > 0 && enemy.currentHp > 0 && turn <= 8 && !showPaytableModal) {
          e.preventDefault();
          soundFx.playClick();
          handlePlayerSpin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [turnPhase, player.currentHp, enemy.currentHp, turn, showPaytableModal]);

  const handlePlayerSpin = () => {
    if (turnPhase !== 'player_ready' || player.currentHp <= 0 || enemy.currentHp <= 0 || turn > 8) return;

    soundFx.playClick();
    setTurnPhase('player_spinning');
    setSpinningReelIndex([true, true, true]);
    setFloatingDamage(null);
    setScreenFlash(null);
    setAbilityBanner(null);

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

      executePlayerOutcome(finalPlayerReels);
    }, 1600);
  };

  const [pendingWildReels, setPendingWildReels] = useState<SymbolType[] | null>(null);

  const executePlayerOutcome = (finalReels: SymbolType[]) => {
    if (finalReels.includes('wild') && !isAutoBattle) {
      setPendingWildReels(finalReels);
      return;
    }
    finishExecutePlayerOutcome(finalReels);
  };

  const finishExecutePlayerOutcome = (finalReels: SymbolType[], chosenWildSymbol?: SymbolType) => {
    const playerTurnResult = resolveTurn(
      turn,
      player,
      enemy,
      finalReels,
      activeEntangledPlayer,
      firstNetUsedEnemy,
      chosenWildSymbol
    );

    const { outcome: pOutcome, updatedAttackerShields, updatedDefenderShields } = playerTurnResult;
    setFirstNetUsedEnemy(playerTurnResult.updatedFirstNetUsed);

    // Update streak counter
    if (pOutcome.combination.tier === 'jackpot' || pOutcome.combination.tier === 'common') {
      setStreakCount((prev) => prev + 1);
    } else {
      setStreakCount(0);
    }

    const nextEnemyHp = Math.max(0, enemy.currentHp - pOutcome.netDamage);
    setEnemy((prev) => ({ ...prev, currentHp: nextEnemyHp, shieldCharges: updatedDefenderShields }));
    setPlayer((prev) => ({ ...prev, shieldCharges: updatedAttackerShields }));

    if (pOutcome.shieldBlocked > 0) {
      soundFx.playShieldBlock();
      setFloatingDamage({
        text: `${pOutcome.shieldBlocked} BLOCKED`,
        iconImg: SYMBOL_DISPLAY.shield.image,
        isEnemy: true,
      });
    } else if (pOutcome.netDamage > 0) {
      soundFx.playHit();
      const isJackpot = pOutcome.combination.tier === 'jackpot';
      setFloatingDamage({
        text: `-${pOutcome.netDamage}${isJackpot ? ' CRIT' : ''}`,
        iconImg: isJackpot ? SYMBOL_DISPLAY.class.image : SYMBOL_DISPLAY.sword.image,
        isEnemy: true,
      });
      triggerScreenShake();
      triggerScreenFlash('gold');
    }

    if (pOutcome.abilityTriggered) {
      setAbilityBanner(`⚡ ${pOutcome.abilityTriggered}`);
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

    setTimeout(() => {
      startEnemySpinSequence(nextEnemyHp, updatedAttackerShields, updatedDefenderShields);
    }, 1000);
  };

  const handleChooseWild = (chosenSymbol: SymbolType) => {
    if (!pendingWildReels) return;
    const finalReels = pendingWildReels;
    setPendingWildReels(null);
    finishExecutePlayerOutcome(finalReels, chosenSymbol);
  };

  const startEnemySpinSequence = (currentEnemyHp: number, playerShields: number, enemyShields: number) => {
    setTurnPhase('enemy_spinning');
    setSpinningReelIndex([true, true, true]);
    setFloatingDamage(null);
    setAbilityBanner(null);

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

      executeEnemyOutcome(finalEnemyReels, currentEnemyHp, playerShields, enemyShields);
    }, 1600);
  };

  const executeEnemyOutcome = (finalEnemyReels: SymbolType[], currentEnemyHp: number, playerShields: number, enemyShields: number) => {
    const enemyTurnResult = resolveTurn(
      turn,
      { ...enemy, currentHp: currentEnemyHp, shieldCharges: enemyShields },
      { ...player, shieldCharges: playerShields },
      finalEnemyReels,
      activeEntangledDefender,
      firstNetUsedPlayer
    );

    const { outcome: eOutcome, updatedAttackerShields, updatedDefenderShields } = enemyTurnResult;
    setFirstNetUsedPlayer(enemyTurnResult.updatedFirstNetUsed);

    const nextPlayerHp = Math.max(0, player.currentHp - eOutcome.netDamage);
    setPlayer((prev) => ({ ...prev, currentHp: nextPlayerHp, shieldCharges: updatedDefenderShields }));
    setEnemy((prev) => ({ ...prev, currentHp: currentEnemyHp, shieldCharges: updatedAttackerShields }));

    if (eOutcome.shieldBlocked > 0) {
      soundFx.playShieldBlock();
      setFloatingDamage({
        text: `${eOutcome.shieldBlocked} BLOCKED`,
        iconImg: SYMBOL_DISPLAY.shield.image,
        isEnemy: false,
      });
    } else if (eOutcome.netDamage > 0) {
      soundFx.playHit();
      const isJackpot = eOutcome.combination.tier === 'jackpot';
      setFloatingDamage({
        text: `-${eOutcome.netDamage}`,
        iconImg: isJackpot ? SYMBOL_DISPLAY.class.image : SYMBOL_DISPLAY.sword.image,
        isEnemy: false,
      });
      triggerScreenShake();
      triggerScreenFlash('red');
    }

    if (eOutcome.abilityTriggered) {
      setAbilityBanner(`⚠️ ENEMY: ${eOutcome.abilityTriggered}`);
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

  const triggerScreenFlash = (type: 'gold' | 'red') => {
    setScreenFlash(type);
    setTimeout(() => setScreenFlash(null), 600);
  };

  const finishMatch = (finalP: Gladiator, finalE: Gladiator, finalTurn: number, lastOutcome: TurnOutcome) => {
    const isWinner = finalP.currentHp > finalE.currentHp;
    const fullHistory = combatLogs.some((h) => h === lastOutcome)
      ? combatLogs
      : [lastOutcome, ...combatLogs];

    onFinishBattle({
      playerGladiator: finalP,
      enemyGladiator: finalE,
      currentTurn: finalTurn,
      isPlayerTurn: false,
      isSpinning: false,
      lockedReelIndexes: [false, false, false],
      history: fullHistory,
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
      {/* Screen Flashes */}
      {screenFlash === 'gold' && <div className="screen-flash-gold" />}
      {screenFlash === 'red' && <div className="screen-flash-red" />}

      {/* Ability Callout Banner */}
      {abilityBanner && <div className="ability-banner">{abilityBanner}</div>}

      {/* Floating Damage Text with High-Res Symbol Icons */}
      {floatingDamage && (
        <div
          className="floating-dmg"
          style={{
            color: floatingDamage.isEnemy ? '#ef4444' : '#60a5fa',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          {floatingDamage.iconImg && (
            <img
              src={floatingDamage.iconImg}
              alt=""
              style={{
                width: '42px',
                height: '42px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px currentColor)',
              }}
            />
          )}
          <span>{floatingDamage.text}</span>
        </div>
      )}

      {/* Top Turn Header Pill, Paytable Button & Auto Battle Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: isEnemyTurn ? 'rgba(239, 68, 68, 0.3)' : 'rgba(14, 18, 28, 0.95)',
            padding: '0.35rem 0.9rem',
            borderRadius: '16px',
            border: `1.5px solid ${isEnemyTurn ? '#ef4444' : 'var(--color-border-gold)'}`,
            fontSize: '0.8rem',
            fontWeight: 900,
            color: isEnemyTurn ? '#f87171' : '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}
        >
          {isEnemyTurn ? <AlertTriangle size={15} color="#ef4444" /> : <Swords size={15} color="#f59e0b" />}
          <span>{isEnemyTurn ? `RIVAL TURN ${turn}` : `YOUR TURN (${turn}/8)`}</span>
        </div>

        {/* STREAK BADGE */}
        {streakCount > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
              border: '1px solid #fef08a',
              borderRadius: '16px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 900,
              color: '#000',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)',
              animation: 'symbolPulse 1.2s infinite alternate',
            }}
          >
            <Flame size={15} color="#000" />
            <span>STREAK x{streakCount}</span>
          </div>
        )}

        {/* Paytable & EV Info Button */}
        <button
          className="header-btn"
          onClick={() => {
            soundFx.playClick();
            setShowPaytableModal(true);
          }}
          onMouseEnter={() => soundFx.playHover()}
          style={{ height: '32px', fontSize: '0.75rem', borderColor: 'var(--color-gold)' }}
        >
          <Info size={14} color="var(--color-gold)" />
          <span>PAYTABLE & EV</span>
        </button>

        {/* Auto Battle Checkbox Toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: isAutoBattle ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.35) 100%)' : 'rgba(14, 18, 28, 0.95)',
            border: `1.5px solid ${isAutoBattle ? '#facc15' : 'rgba(255, 255, 255, 0.25)'}`,
            borderRadius: '16px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.78rem',
            fontWeight: 900,
            color: isAutoBattle ? '#facc15' : '#9ca3af',
            cursor: 'pointer',
            boxShadow: isAutoBattle ? '0 0 15px rgba(245, 158, 11, 0.45)' : 'none',
            transition: 'all 0.2s ease-in-out',
            userSelect: 'none',
          }}
          onMouseEnter={() => soundFx.playHover()}
        >
          <input
            type="checkbox"
            checked={isAutoBattle}
            onChange={(e) => {
              soundFx.playClick();
              setIsAutoBattle(e.target.checked);
            }}
            style={{ width: '14px', height: '14px', accentColor: '#f59e0b', cursor: 'pointer' }}
          />
          <Bot size={15} color={isAutoBattle ? '#facc15' : '#9ca3af'} />
          <span>AUTO</span>
        </label>
      </div>

      {/* Queen Fortuna Early Combat Blessing Banner */}
      {turn <= 2 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(10, 14, 22, 0.85) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '0.3rem 0.7rem',
            maxWidth: '560px',
            flexShrink: 0,
          }}
        >
          <img
            src="./assets/Fortuna-NPC-torso.png"
            alt="Queen Fortuna"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #facc15',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '0.72rem', color: '#e5e7eb' }}>
            <strong style={{ color: '#facc15' }}>Fortuna's Blessing:</strong> "Spin the Reels of Fate! Align 3 matching symbols for a Jackpot, or collect Shields to absorb incoming strikes!"
          </span>
        </div>
      )}

      {/* MOBILE COMPACT VERSUS HEADER STRIP (< 820px) */}
      <div className="mobile-versus-strip">
        <div className="mobile-fighter-col player">
          <img src={playerArch.portrait} alt={player.name} className="mobile-avatar" />
          <div className="mobile-fighter-info">
            <div className="mobile-fighter-name">{player.name}</div>
            <div className="stage-hp-track" style={{ height: '18px', marginTop: '0.2rem' }}>
              <div className="stage-hp-fill" style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }} />
              <span className="stage-hp-val" style={{ fontSize: '0.64rem', fontWeight: 900, lineHeight: '18px', textShadow: '0 1px 2px #000' }}>
                {player.currentHp}/{player.maxHp} HP
              </span>
            </div>
            {player.shieldCharges > 0 && (
              <span className="mobile-shield-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <img src={SYMBOL_DISPLAY.shield.image} alt="" style={{ width: '12px', height: '12px' }} />
                <span>{player.shieldCharges}</span>
              </span>
            )}
          </div>
        </div>

        <div className="mobile-vs-badge">VS</div>

        <div className="mobile-fighter-col enemy">
          <div className="mobile-fighter-info" style={{ textAlign: 'right' }}>
            <div className="mobile-fighter-name">{enemy.name}</div>
            <div className="stage-hp-track" style={{ height: '18px', marginTop: '0.2rem' }}>
              <div className="stage-hp-fill enemy" style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }} />
              <span className="stage-hp-val" style={{ fontSize: '0.64rem', fontWeight: 900, lineHeight: '18px', textShadow: '0 1px 2px #000' }}>
                {enemy.currentHp}/{enemy.maxHp} HP
              </span>
            </div>
            {enemy.shieldCharges > 0 && (
              <span className="mobile-shield-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <img src={SYMBOL_DISPLAY.shield.image} alt="" style={{ width: '12px', height: '12px' }} />
                <span>{enemy.shieldCharges}</span>
              </span>
            )}
          </div>
          <img src={enemy.avatarUrl} alt={enemy.name} className="mobile-avatar" style={{ borderColor: '#ef4444' }} />
        </div>
      </div>

      {/* RESPONSIVE ARENA STAGE: Flanks on Desktop, Stacks on Mobile */}
      <div className="battle-arena-stage">
        {/* Player Gladiator Card */}
        <div className={`stage-fighter-card player-side ${!isEnemyTurn ? 'pulse' : ''}`}>
          <img src={playerArch.portrait} alt={player.name} className="stage-avatar-large" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{player.name}</h3>
          <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase' }}>
            {playerArch.name} ({playerArch.subName})
          </span>

          <div className="stage-hp-track">
            <div className="stage-hp-fill" style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }} />
            <span className="stage-hp-val">{player.currentHp} / {player.maxHp} HP</span>
          </div>

          {/* ACTIVE SHIELD BADGE */}
          {player.shieldCharges > 0 && (
            <div style={{ background: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', border: '1px solid #3b82f6', borderRadius: '12px', padding: '0.2rem 0.6rem', marginTop: '0.4rem', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <img src={SYMBOL_DISPLAY.shield.image} alt="" style={{ width: '16px', height: '16px' }} />
              <span>{player.shieldCharges} SHIELD ARMOR</span>
            </div>
          )}
        </div>

        {/* Centerpiece Grand Casino Slot Cabinet */}
        <div
          className="slot-frame"
          style={{
            borderColor: isEnemyTurn ? '#ef4444' : 'var(--color-gold)',
            boxShadow: isEnemyTurn ? '0 0 55px rgba(239, 68, 68, 0.5), inset 0 0 35px rgba(0,0,0,0.95)' : '0 0 50px rgba(245, 158, 11, 0.45), inset 0 0 35px rgba(0,0,0,0.95)',
          }}
        >
          {/* LED Strip */}
          <div className="slot-led-strip">
            <div className="slot-led" />
            <div className="slot-led" />
            <div className="slot-led" />
            <div className="slot-led" />
            <div className="slot-led" />
          </div>

          <div style={{ fontSize: '0.82rem', fontWeight: 900, color: isEnemyTurn ? '#f87171' : 'var(--color-gold)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {isEnemyTurn ? `⚠️ ${enemy.name.toUpperCase()}'S ATTACK REELS` : 'YOUR COMBAT REELS'}
          </div>

          {/* 3 Reel Slots with Rendered High-Res Symbols */}
          <div className="slot-reels-container">
            {reels.map((sym, idx) => {
              const display = SYMBOL_DISPLAY[sym];
              const isReelSpinning = spinningReelIndex[idx];
              return (
                <div
                  key={idx}
                  className={`slot-reel ${isReelSpinning ? 'active-spin' : ''}`}
                  style={{
                    borderColor: isEnemyTurn ? 'rgba(239, 68, 68, 0.75)' : 'rgba(245, 158, 11, 0.75)',
                  }}
                >
                  <div className="slot-symbol-content">
                    <img
                      src={display.image}
                      alt={display.label}
                      className="slot-symbol-icon-img"
                    />
                    <span className="slot-symbol-tag" style={{ color: display.color }}>{display.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action CTA Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
            <div style={{ display: 'flex', gap: '0.6rem', width: '100%', justifyContent: 'center' }}>
              <button
                className="spin-cta-button"
                style={{
                  background: isEnemyTurn
                    ? 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #991b1b 100%)',
                }}
                onClick={handlePlayerSpin}
                onMouseEnter={() => soundFx.playHover()}
                disabled={turnPhase !== 'player_ready' || player.currentHp <= 0 || enemy.currentHp <= 0}
              >
                {turnPhase === 'player_spinning'
                  ? 'SPINNING...'
                  : isEnemyTurn
                  ? 'ENEMY ROLLING...'
                  : isAutoBattle
                  ? '⚡ AUTO ROLLING...'
                  : 'SPIN REELS'}
              </button>

              {canReroll && !isEnemyTurn && (
                <button
                  className="btn btn-secondary"
                  onClick={handlePlayerSpin}
                  onMouseEnter={() => soundFx.playHover()}
                  style={{ padding: '0.6rem 0.9rem', borderColor: '#a855f7', color: '#c084fc' }}
                >
                  <RefreshCw size={16} />
                  <span>REROLL</span>
                </button>
              )}
            </div>
            {turnPhase === 'player_ready' && (
              <span style={{ fontSize: '0.68rem', color: isAutoBattle ? '#facc15' : 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.05em' }}>
                {isAutoBattle ? '⚡ AUTO BATTLE SPECTATOR MODE ACTIVE' : '[PRESS SPACEBAR OR CLICK TO SPIN]'}
              </span>
            )}
          </div>
        </div>

        {/* Rival Gladiator Card */}
        <div className={`stage-fighter-card enemy-side ${isEnemyTurn ? 'pulse' : ''}`}>
          <img src={enemy.avatarUrl} alt={enemy.name} className="stage-avatar-large" style={{ borderColor: '#ef4444' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{enemy.name}</h3>
          <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase' }}>
            {enemyArch.name} ({enemyArch.subName})
          </span>

          <div className="stage-hp-track">
            <div className="stage-hp-fill enemy" style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }} />
            <span className="stage-hp-val">{enemy.currentHp} / {enemy.maxHp} HP</span>
          </div>

          {/* ACTIVE SHIELD BADGE FOR ENEMY */}
          {enemy.shieldCharges > 0 && (
            <div style={{ background: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', border: '1px solid #3b82f6', borderRadius: '12px', padding: '0.2rem 0.6rem', marginTop: '0.4rem', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <img src={SYMBOL_DISPLAY.shield.image} alt="" style={{ width: '16px', height: '16px' }} />
              <span>{enemy.shieldCharges} SHIELD ARMOR</span>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Log Strip */}
      <div style={{ width: '100%', maxWidth: '640px', background: 'rgba(10, 14, 22, 0.92)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '14px', padding: '0.4rem 0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowLogDrawer(!showLogDrawer)}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-gold)' }}>
            {combatLogs[0] ? `LAST ROLL: ${combatLogs[0].logMessage}` : 'Tap Spin to start battle action...'}
          </span>
          {showLogDrawer ? <ChevronDown size={16} color="var(--color-gold)" /> : <ChevronUp size={16} color="var(--color-gold)" />}
        </div>

        {showLogDrawer && (
          <div style={{ marginTop: '0.4rem', maxHeight: '90px', overflowY: 'auto', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '0.4rem' }}>
            {combatLogs.map((l, i) => (
              <div key={i} style={{ color: l.attackerId === player.id ? '#60a5fa' : '#f87171' }}>
                <strong>{l.attackerName}:</strong> {l.logMessage}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IN-BATTLE PAYTABLE & EV MODAL DRAWER */}
      {showPaytableModal && (() => {
        const playerGearDmg = (player.equippedGear?.weapon?.damageBonus || 0) + (player.equippedGear?.crest?.damageBonus || 0);
        const playerGearShield = (player.equippedGear?.armor?.shieldBonus || 0) + (player.equippedGear?.crest?.shieldBonus || 0);
        const playerGearHp = (player.equippedGear?.armor?.hpBonus || 0) + (player.equippedGear?.crest?.hpBonus || 0);

        const effectiveDmgEV = (24.5 + playerGearDmg).toFixed(1);
        const effectiveShieldEV = (12.5 + playerGearShield).toFixed(1);
        const hasActiveGear = playerGearDmg > 0 || playerGearShield > 0 || playerGearHp > 0;

        return (
          <div className="modal-overlay" style={{ zIndex: 9999, background: 'rgba(4, 6, 12, 0.85)', backdropFilter: 'blur(8px)' }}>
            <div className="modal-content" style={{ borderColor: 'var(--color-gold)', textAlign: 'left', maxWidth: '520px', padding: '1.2rem', position: 'relative' }}>
              <button
                onClick={() => setShowPaytableModal(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-gold)',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.25rem', color: '#facc15', marginBottom: '0.2rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Info size={18} color="#facc15" />
                <span>SLOT PAYTABLE & EXPECTED VALUE (EV)</span>
              </h2>

              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.6rem' }}>
                Reels roll 4 symbol types (Sword 35%, Shield 30%, Ability 25%, Wild 10%). Values update dynamically based on your equipped gear loadout.
              </p>

              {/* Active Gear Summary Banner */}
              {hasActiveGear && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', padding: '0.35rem 0.7rem', marginBottom: '0.7rem', fontSize: '0.74rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>🛡️ ACTIVE GEAR LOADOUT:</span>
                  <span>+{playerGearDmg} Damage</span>
                  <span>• +{playerGearShield} Shield Armor</span>
                  <span>• +{playerGearHp} Max HP</span>
                </div>
              )}

              {/* EV STATS SUMMARY BOX */}
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--color-gold)', borderRadius: '10px', padding: '0.5rem 0.8rem', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-gold)', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>EXPECTED DAMAGE / SPIN</span>
                  <strong style={{ fontSize: '1.1rem', color: '#fff' }}>
                    {effectiveDmgEV} Dmg
                    {playerGearDmg > 0 && <span style={{ fontSize: '0.72rem', color: '#10b981', marginLeft: '0.3rem' }}>(+{playerGearDmg} Gear)</span>}
                  </strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.68rem', color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>EXPECTED SHIELD / SPIN</span>
                  <strong style={{ fontSize: '1.1rem', color: '#60a5fa' }}>
                    {effectiveShieldEV} Shield
                    {playerGearShield > 0 && <span style={{ fontSize: '0.72rem', color: '#10b981', marginLeft: '0.3rem' }}>(+{playerGearShield} Gear)</span>}
                  </strong>
                </div>
              </div>

              {/* PAYOUT TABLE LIST */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', marginBottom: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-gold)', textAlign: 'left' }}>
                    <th style={{ padding: '0.3rem' }}>COMBINATION</th>
                    <th style={{ padding: '0.3rem' }}>TIER</th>
                    <th style={{ padding: '0.3rem' }}>EFFECT / PAYOUT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '0.35rem', color: '#ef4444', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <img src={SYMBOL_DISPLAY.sword.image} alt="" style={{ width: '20px', height: '20px' }} />
                      <span>3x Sword</span>
                    </td>
                    <td style={{ padding: '0.35rem', color: '#f59e0b' }}>Jackpot</td>
                    <td style={{ padding: '0.35rem', color: '#fff' }}>
                      {playerGearDmg > 0 ? (
                        <span>
                          40 <span style={{ color: '#10b981', fontWeight: 800 }}>(+{playerGearDmg} Gear)</span> = <strong>{40 + playerGearDmg} Raw Damage</strong>
                        </span>
                      ) : (
                        '40 Raw Damage'
                      )}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '0.35rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <img src={SYMBOL_DISPLAY.sword.image} alt="" style={{ width: '20px', height: '20px' }} />
                      <span>2x Sword</span>
                    </td>
                    <td style={{ padding: '0.35rem', color: '#9ca3af' }}>Common</td>
                    <td style={{ padding: '0.35rem', color: '#fff' }}>
                      {playerGearDmg > 0 ? (
                        <span>
                          25 <span style={{ color: '#10b981', fontWeight: 800 }}>(+{playerGearDmg} Gear)</span> = <strong>{25 + playerGearDmg} Raw Damage</strong>
                        </span>
                      ) : (
                        '25 Raw Damage'
                      )}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '0.35rem', color: '#3b82f6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <img src={SYMBOL_DISPLAY.shield.image} alt="" style={{ width: '20px', height: '20px' }} />
                      <span>3x Shield</span>
                    </td>
                    <td style={{ padding: '0.35rem', color: '#f59e0b' }}>Jackpot</td>
                    <td style={{ padding: '0.35rem', color: '#fff' }}>
                      {playerGearShield > 0 ? (
                        <span>
                          +22 <span style={{ color: '#60a5fa', fontWeight: 800 }}>(+{playerGearShield} Gear)</span> = <strong>+{22 + playerGearShield} Shield Armor</strong>
                        </span>
                      ) : (
                        '+22 Shield Protection'
                      )}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '0.35rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <img src={SYMBOL_DISPLAY.shield.image} alt="" style={{ width: '20px', height: '20px' }} />
                      <span>2x Shield</span>
                    </td>
                    <td style={{ padding: '0.35rem', color: '#9ca3af' }}>Common</td>
                    <td style={{ padding: '0.35rem', color: '#fff' }}>
                      {playerGearShield > 0 ? (
                        <span>
                          +14 <span style={{ color: '#60a5fa', fontWeight: 800 }}>(+{playerGearShield} Gear)</span> = <strong>+{14 + playerGearShield} Shield Armor</strong>
                        </span>
                      ) : (
                        '+14 Shield Protection'
                      )}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '0.35rem', color: '#f59e0b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <img src={SYMBOL_DISPLAY.class.image} alt="" style={{ width: '20px', height: '20px' }} />
                      <span>3x Ability</span>
                    </td>
                    <td style={{ padding: '0.35rem', color: '#f59e0b' }}>Jackpot</td>
                    <td style={{ padding: '0.35rem', color: '#fff' }}>Archetype Ultimate Perk</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.35rem', color: '#a855f7', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <img src={SYMBOL_DISPLAY.wild.image} alt="" style={{ width: '20px', height: '20px' }} />
                      <span>Wild Symbol</span>
                    </td>
                    <td style={{ padding: '0.35rem', color: '#a855f7' }}>Wild</td>
                    <td style={{ padding: '0.35rem', color: '#fff' }}>Choose any symbol match</td>
                  </tr>
                </tbody>
              </table>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}
                onClick={() => setShowPaytableModal(false)}
              >
                GOT IT, RETURN TO BATTLE
              </button>
            </div>
          </div>
        );
      })()}

      {/* WILD CHOICE RESOLUTION OVERLAY MODAL */}
      {pendingWildReels && (
        <div className="modal-overlay" style={{ zIndex: 9999, background: 'rgba(4, 6, 12, 0.85)', backdropFilter: 'blur(6px)' }}>
          <div className="modal-content" style={{ borderColor: 'var(--color-gold)', textAlign: 'center', maxWidth: '420px', padding: '1.4rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#facc15', marginBottom: '0.2rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <img src={SYMBOL_DISPLAY.wild.image} alt="Wild" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              <span>WILD SYMBOL ROLLED!</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', marginBottom: '0.6rem' }}>
              Inspect your 3 reels below and choose how to resolve your Wild symbol:
            </p>

            {/* ROLLED REELS VISUAL PREVIEW */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.1rem', background: 'rgba(0,0,0,0.4)', padding: '0.6rem', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              {pendingWildReels.map((sym, idx) => {
                const isWild = sym === 'wild';
                const display = SYMBOL_DISPLAY[sym];
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      background: isWild ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: isWild ? '2px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '0.4rem 0.3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}
                  >
                    <span style={{ fontSize: '0.62rem', color: isWild ? '#c084fc' : '#9ca3af', fontWeight: 800 }}>
                      REEL {idx + 1}
                    </span>
                    <img src={display.image} alt={display.label} style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: display.color }}>{display.label}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  soundFx.playClick();
                  handleChooseWild('sword');
                }}
                onMouseEnter={() => soundFx.playHover()}
                style={{ padding: '0.65rem', justifyContent: 'center', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <img src={SYMBOL_DISPLAY.sword.image} alt="Sword" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                <span>SWORD — Maximize Attack Damage</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  soundFx.playClick();
                  handleChooseWild('shield');
                }}
                onMouseEnter={() => soundFx.playHover()}
                style={{ padding: '0.65rem', justifyContent: 'center', fontSize: '0.85rem', borderColor: '#3b82f6', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <img src={SYMBOL_DISPLAY.shield.image} alt="Shield" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                <span>SHIELD — Raise Defense Armor</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  soundFx.playClick();
                  handleChooseWild('class');
                }}
                onMouseEnter={() => soundFx.playHover()}
                style={{ padding: '0.65rem', justifyContent: 'center', fontSize: '0.85rem', borderColor: '#a855f7', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <img src={SYMBOL_DISPLAY.class.image} alt="Ability" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                <span>ABILITY — Trigger Archetype Perk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

