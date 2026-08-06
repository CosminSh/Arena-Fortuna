import React, { useState } from 'react';
import { Gladiator, SymbolType, BattleState, TurnOutcome } from '../types/game';
import { ARCHETYPES, spinReels, resolveTurn } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { triggerGladiatorArenaSparks } from '../engine/arenaParticles';
import { Swords, Shield, RefreshCw, Zap, ChevronDown, ChevronUp, AlertTriangle, Bot } from 'lucide-react';

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
  const [screenFlash, setScreenFlash] = useState<'gold' | 'red' | null>(null);
  const [abilityBanner, setAbilityBanner] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showLogDrawer, setShowLogDrawer] = useState<boolean>(false);

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
        if (turnPhase === 'player_ready' && player.currentHp > 0 && enemy.currentHp > 0 && turn <= 8) {
          e.preventDefault();
          soundFx.playClick();
          handlePlayerSpin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [turnPhase, player.currentHp, enemy.currentHp, turn]);

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

  const executePlayerOutcome = (finalReels: SymbolType[]) => {
    const playerTurnResult = resolveTurn(
      turn,
      player,
      enemy,
      finalReels,
      activeEntangledPlayer,
      firstNetUsedEnemy
    );

    const { outcome: pOutcome, updatedAttackerShields, updatedDefenderShields } = playerTurnResult;
    setFirstNetUsedEnemy(playerTurnResult.updatedFirstNetUsed);

    const nextEnemyHp = Math.max(0, enemy.currentHp - pOutcome.netDamage);
    setEnemy((prev) => ({ ...prev, currentHp: nextEnemyHp, shieldCharges: updatedDefenderShields }));
    setPlayer((prev) => ({ ...prev, shieldCharges: updatedAttackerShields }));

    if (pOutcome.shieldBlocked > 0) {
      soundFx.playShieldBlock();
      setFloatingDamage({ text: `🛡️ ${pOutcome.shieldBlocked} BLOCKED`, isEnemy: true });
    } else if (pOutcome.netDamage > 0) {
      soundFx.playHit();
      setFloatingDamage({ text: `-${pOutcome.netDamage}`, isEnemy: true });
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
      setFloatingDamage({ text: `🛡️ ${eOutcome.shieldBlocked} BLOCKED`, isEnemy: false });
    } else if (eOutcome.netDamage > 0) {
      soundFx.playHit();
      setFloatingDamage({ text: `-${eOutcome.netDamage}`, isEnemy: false });
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

      {/* Floating Damage Text */}
      {floatingDamage && (
        <div className="floating-dmg" style={{ color: floatingDamage.isEnemy ? '#ef4444' : '#60a5fa' }}>
          {floatingDamage.text}
        </div>
      )}

      {/* Top Turn Header Pill & Auto Battle Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: isEnemyTurn ? 'rgba(239, 68, 68, 0.3)' : 'rgba(14, 18, 28, 0.95)',
            padding: '0.35rem 1.1rem',
            borderRadius: '16px',
            border: `1.5px solid ${isEnemyTurn ? '#ef4444' : 'var(--color-border-gold)'}`,
            fontSize: '0.82rem',
            fontWeight: 900,
            color: isEnemyTurn ? '#f87171' : '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}
        >
          {isEnemyTurn ? <AlertTriangle size={16} color="#ef4444" /> : <Swords size={16} color="#f59e0b" />}
          <span>{isEnemyTurn ? `RIVAL ATTACK ROLLING (TURN ${turn})` : `YOUR TURN (TURN ${turn} / 8)`}</span>
        </div>

        {/* Auto Battle Checkbox Toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: isAutoBattle ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.35) 100%)' : 'rgba(14, 18, 28, 0.95)',
            border: `1.5px solid ${isAutoBattle ? '#facc15' : 'rgba(255, 255, 255, 0.25)'}`,
            borderRadius: '16px',
            padding: '0.35rem 0.9rem',
            fontSize: '0.82rem',
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
            style={{
              width: '16px',
              height: '16px',
              accentColor: '#f59e0b',
              cursor: 'pointer',
            }}
          />
          <Bot size={16} color={isAutoBattle ? '#facc15' : '#9ca3af'} />
          <span>AUTO BATTLE {isAutoBattle ? '(ON)' : '(OFF)'}</span>
        </label>
      </div>

      {/* MOBILE COMPACT VERSUS HEADER STRIP (< 820px) */}
      <div className="mobile-versus-strip">
        <div className="mobile-fighter-col player">
          <img src={playerArch.portrait} alt={player.name} className="mobile-avatar" />
          <div className="mobile-fighter-info">
            <div className="mobile-fighter-name">{player.name}</div>
            <div className="stage-hp-track" style={{ height: '12px', marginTop: '0.15rem' }}>
              <div className="stage-hp-fill" style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }} />
              <span className="stage-hp-val" style={{ fontSize: '0.65rem' }}>{player.currentHp}/{player.maxHp} HP</span>
            </div>
            {player.shieldCharges > 0 && (
              <span className="mobile-shield-badge">🛡️ {player.shieldCharges}</span>
            )}
          </div>
        </div>

        <div className="mobile-vs-badge">VS</div>

        <div className="mobile-fighter-col enemy">
          <div className="mobile-fighter-info" style={{ textAlign: 'right' }}>
            <div className="mobile-fighter-name">{enemy.name}</div>
            <div className="stage-hp-track" style={{ height: '12px', marginTop: '0.15rem' }}>
              <div className="stage-hp-fill enemy" style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }} />
              <span className="stage-hp-val" style={{ fontSize: '0.65rem' }}>{enemy.currentHp}/{enemy.maxHp} HP</span>
            </div>
            {enemy.shieldCharges > 0 && (
              <span className="mobile-shield-badge">🛡️ {enemy.shieldCharges}</span>
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
            <div style={{ background: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', border: '1px solid #3b82f6', borderRadius: '12px', padding: '0.2rem 0.6rem', marginTop: '0.4rem', fontSize: '0.75rem', fontWeight: 800 }}>
              🛡️ {player.shieldCharges} SHIELD ARMOR
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
            <div style={{ background: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', border: '1px solid #3b82f6', borderRadius: '12px', padding: '0.2rem 0.6rem', marginTop: '0.4rem', fontSize: '0.75rem', fontWeight: 800 }}>
              🛡️ {enemy.shieldCharges} SHIELD ARMOR
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
    </div>
  );
};
