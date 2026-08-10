import React, { useState, useEffect, useMemo } from 'react';
import { Gladiator, GearItem } from '../types/game';
import { ARCHETYPES, getRandomScoutingTargets, simulateMatchup, AVAILABLE_GEAR, getGearStats } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { ArrowLeft, Swords, Activity, RefreshCw, Shield, Sparkles, Wrench, Check, X } from 'lucide-react';

interface TargetSelectViewProps {
  playerGladiator: Gladiator;
  onSelectTarget: (enemy: Gladiator) => void;
  onBack: () => void;
  onUpdateEquippedGear?: (gear: { weapon?: GearItem; armor?: GearItem; crest?: GearItem }) => void;
}

export const TargetSelectView: React.FC<TargetSelectViewProps> = ({
  playerGladiator,
  onSelectTarget,
  onBack,
  onUpdateEquippedGear,
}) => {
  const [activeTargets, setActiveTargets] = useState<Gladiator[]>(() => getRandomScoutingTargets(4));
  const [showGearModal, setShowGearModal] = useState<boolean>(false);

  const playerArch = ARCHETYPES[playerGladiator.archetypeId];
  const equipped = playerGladiator.equippedGear || {};
  const gearStats = getGearStats(playerGladiator.equippedGear);
  const totalDmgBonus = gearStats.damageBonus;
  const totalShieldBonus = gearStats.shieldBonus;
  const totalHpBonus = gearStats.hpBonus;

  const handleRefresh = () => {
    soundFx.playClick();
    setActiveTargets(getRandomScoutingTargets(4));
  };

  const handleEquipItem = (item: GearItem) => {
    soundFx.playClick();
    const currentEquipped = playerGladiator.equippedGear || {};
    const isEquipped = currentEquipped[item.slot]?.id === item.id;
    const newEquipped = {
      ...currentEquipped,
      [item.slot]: isEquipped ? undefined : item,
    };
    if (onUpdateEquippedGear) {
      onUpdateEquippedGear(newEquipped);
    }
  };

  const [simResults, setSimResults] = useState<Record<string, { winRate: number; avgTurns: number }>>({});
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Run Monte Carlo combat simulations off the main thread via Web Worker
  useEffect(() => {
    setIsSimulating(true);
    let worker: Worker | null = null;
    try {
      worker = new Worker(new URL('../workers/simulationWorker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        setSimResults(e.data);
        setIsSimulating(false);
      };
      worker.postMessage({ player: playerGladiator, targets: activeTargets, simulations: 500 });
    } catch {
      // Fallback if Web Worker is restricted or unsupported
      const results: Record<string, { winRate: number; avgTurns: number }> = {};
      activeTargets.forEach((enemy) => {
        const { playerWinRate, averageTurns } = simulateMatchup(playerGladiator, enemy, 500);
        results[enemy.id] = { winRate: playerWinRate, avgTurns: averageTurns };
      });
      setSimResults(results);
      setIsSimulating(false);
    }

    return () => {
      if (worker) worker.terminate();
    };
  }, [playerGladiator, activeTargets]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.45rem',
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          onMouseEnter={() => soundFx.playHover()}
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <h2 style={{ fontSize: '1.15rem', color: '#fff', textAlign: 'center', margin: 0 }}>
          SCOUT RIVAL TARGETS
        </h2>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: '#10b981', background: 'rgba(16, 185, 129, 0.18)', color: '#10b981' }}
            onClick={() => {
              soundFx.playClick();
              setShowGearModal(true);
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <Wrench size={14} color="#10b981" />
            <span>CHANGE GEAR</span>
            <Sparkles size={12} color="#facc15" />
          </button>

          <button
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: 'var(--color-gold)' }}
            onClick={handleRefresh}
            onMouseEnter={() => soundFx.playHover()}
          >
            <RefreshCw size={14} />
            <span>Refresh List</span>
          </button>
        </div>
      </div>

      {/* Pre-Battle Active Loadout Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(16, 185, 129, 0.14)',
          border: '1px solid #10b981',
          borderRadius: '12px',
          padding: '0.4rem 0.8rem',
          flexShrink: 0,
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Wrench size={15} color="#10b981" />
          <span style={{ fontSize: '0.76rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>
            PRE-BATTLE GEAR:
          </span>
          <span style={{ fontSize: '0.74rem', color: '#fff', fontWeight: 700 }}>
            {equipped.weapon ? `${equipped.weapon.icon} ${equipped.weapon.name}` : 'No Weapon'}
            {' • '}
            {equipped.armor ? `${equipped.armor.icon} ${equipped.armor.name}` : 'No Armor'}
            {' • '}
            {equipped.crest ? `${equipped.crest.icon} ${equipped.crest.name}` : 'No Crest'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.72rem', fontWeight: 800 }}>
          {totalDmgBonus > 0 && <span style={{ color: '#ef4444' }}>⚔️ +{totalDmgBonus} Dmg</span>}
          {totalShieldBonus > 0 && <span style={{ color: '#60a5fa' }}>🛡️ +{totalShieldBonus} Shield</span>}
          <span style={{ color: '#10b981' }}>❤️ {playerGladiator.maxHp} HP</span>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.55rem', fontSize: '0.68rem', borderColor: '#10b981', background: 'rgba(16, 185, 129, 0.25)', color: '#10b981' }}
            onClick={() => {
              soundFx.playClick();
              setShowGearModal(true);
            }}
            onMouseEnter={() => soundFx.playHover()}
          >
            <span>EDIT</span>
          </button>
        </div>
      </div>

      {/* Queen Fortuna Tactical Guidance Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.18) 0%, rgba(14, 18, 28, 0.85) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '12px',
          padding: '0.4rem 0.8rem',
          flexShrink: 0,
        }}
      >
        <img
          src="./assets/Fortuna-NPC-torso.png"
          alt="Queen Fortuna"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1.5px solid #facc15',
            boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)',
            flexShrink: 0,
          }}
        />
        <div style={{ fontSize: '0.74rem', color: '#e5e7eb', lineHeight: 1.3 }}>
          <strong style={{ color: '#facc15' }}>Queen Fortuna's Advice:</strong> "Swap your gear loadout above to see your Monte Carlo win rate adjust in real-time before entering battle! Once the battle begins, your equipment is locked."
        </div>
      </div>

      {/* 2x2 Target Cards Grid */}
      <div id="target-scout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', flex: 1, maxHeight: 'calc(100vh - 170px)' }}>
        {activeTargets.map((enemy) => {
          const enemyArch = ARCHETYPES[enemy.archetypeId];
          const isFavored = playerArch.favoredAgainst === enemy.archetypeId;
          const isWeak = playerArch.weakAgainst === enemy.archetypeId;
          const sim = simResults[enemy.id] || { winRate: 50, avgTurns: 5 };

          let matchupLabel = 'Neutral Matchup';
          let winProbColor = '#f59e0b';
          if (isFavored) {
            matchupLabel = 'Favored Matchup (+15%)';
            winProbColor = '#10b981';
          } else if (isWeak) {
            matchupLabel = 'Difficult Matchup (-15%)';
            winProbColor = '#ef4444';
          }

          if (sim.winRate >= 60) winProbColor = '#10b981';
          else if (sim.winRate <= 40) winProbColor = '#ef4444';

          const hasEquippedGear = enemy.equippedGear && (enemy.equippedGear.weapon || enemy.equippedGear.armor || enemy.equippedGear.crest);

          return (
            <div
              key={enemy.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem',
                textAlign: 'center',
                cursor: 'pointer',
                borderColor: winProbColor,
                background: 'linear-gradient(180deg, rgba(18, 22, 31, 0.95) 0%, rgba(10, 12, 16, 0.98) 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => {
                soundFx.playClick();
                onSelectTarget(enemy);
              }}
            >
              {/* Class & Gear Badges */}
              <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '80%' }}>
                {/* Unique Class Archetype Tag */}
                {enemy.archetypeId === 'murmillo' && (
                  <span style={{ fontSize: '0.58rem', fontWeight: 900, color: '#60a5fa', background: 'rgba(59, 130, 246, 0.25)', border: '1px solid #3b82f6', borderRadius: '6px', padding: '0.15rem 0.35rem', whiteSpace: 'nowrap' }}>
                    🛡️ SHIELD TANK
                  </span>
                )}
                {enemy.archetypeId === 'retiarius' && (
                  <span style={{ fontSize: '0.58rem', fontWeight: 900, color: '#c084fc', background: 'rgba(168, 85, 247, 0.25)', border: '1px solid #a855f7', borderRadius: '6px', padding: '0.15rem 0.35rem', whiteSpace: 'nowrap' }}>
                    🕸️ NET DISRUPTOR
                  </span>
                )}
                {enemy.archetypeId === 'thraex' && (
                  <span style={{ fontSize: '0.58rem', fontWeight: 900, color: '#f87171', background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #ef4444', borderRadius: '6px', padding: '0.15rem 0.35rem', whiteSpace: 'nowrap' }}>
                    🗡️ SICA BURSTER
                  </span>
                )}

                {/* Separate Gear Indicator */}
                {hasEquippedGear && (
                  <span style={{ fontSize: '0.58rem', fontWeight: 900, color: '#facc15', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid var(--color-gold)', borderRadius: '6px', padding: '0.15rem 0.35rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                    <Sparkles size={9} />
                    <span>ARMORED</span>
                  </span>
                )}
              </div>

              {/* Avatar & Info */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <img
                  src={enemy.avatarUrl}
                  alt={enemy.name}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: `2px solid ${winProbColor}`,
                    objectFit: 'cover',
                  }}
                />
                <h3 style={{ fontSize: '0.85rem', color: '#fff', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                  {enemy.name}
                </h3>
                <span style={{ fontSize: '0.64rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                  {enemy.houseName}
                </span>
                <span style={{ fontSize: '0.64rem', color: 'var(--color-text-muted)' }}>
                  {enemyArch.name} ({enemy.currentHp} HP, {enemy.shieldCharges} Shield)
                </span>
              </div>

              {/* Matchup & Monte Carlo Simulated Odds */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: winProbColor, textTransform: 'uppercase' }}>
                  {matchupLabel}
                </span>
                <div
                  style={{
                    background: `${winProbColor}20`,
                    border: `1px solid ${winProbColor}60`,
                    borderRadius: '8px',
                    padding: '0.2rem 0.45rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    color: winProbColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Activity size={11} />
                  <span>{sim.winRate}% Sim Win Rate</span>
                </div>
              </div>

              {/* Challenge Button */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.35rem', fontSize: '0.75rem', borderRadius: '8px', marginTop: '0.2rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  onSelectTarget(enemy);
                }}
                onMouseEnter={() => soundFx.playHover()}
              >
                <Swords size={13} />
                <span>CHALLENGE</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Pre-Battle Quick Gear Loadout Modal Overlay */}
      {showGearModal && (
        <div className="modal-overlay" style={{ zIndex: 9999, background: 'rgba(4, 6, 12, 0.88)', backdropFilter: 'blur(10px)' }}>
          <div
            className="modal-content"
            style={{
              borderColor: '#10b981',
              textAlign: 'left',
              maxWidth: '640px',
              padding: '1.4rem',
              position: 'relative',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.98), 0 0 45px rgba(16, 185, 129, 0.3)',
            }}
          >
            <button
              onClick={() => {
                soundFx.playClick();
                setShowGearModal(false);
              }}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
              }}
              onMouseEnter={() => soundFx.playHover()}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <Wrench size={22} color="#10b981" />
              <h2 style={{ fontSize: '1.3rem', color: '#10b981', margin: 0, fontFamily: 'var(--font-serif)' }}>
                PRE-BATTLE EQUIPMENT LOADOUT
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.8rem' }}>
              Equip weapons, armor, and crests before starting combat. Monte Carlo win rates update live as you test different loadouts! Once battle starts, gear is locked.
            </p>

            {/* Dynamic Stats Banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '12px',
                padding: '0.6rem 0.8rem',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.64rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>MAX HEALTH</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>{playerGladiator.maxHp} HP</div>
                <span style={{ fontSize: '0.62rem', color: '#10b981' }}>(+{totalHpBonus} Gear Bonus)</span>
              </div>
              <div>
                <span style={{ fontSize: '0.64rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>BONUS DAMAGE</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f59e0b' }}>+{totalDmgBonus} Dmg</div>
                <span style={{ fontSize: '0.62rem', color: '#f59e0b' }}>(Strikes & Sword Rolls)</span>
              </div>
              <div>
                <span style={{ fontSize: '0.64rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>SHIELD ARMOR</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#60a5fa' }}>+{totalShieldBonus} Armor</div>
                <span style={{ fontSize: '0.62rem', color: '#60a5fa' }}>(Shield Roll Boost)</span>
              </div>
            </div>

            {/* Gear Selection Slots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '50vh', overflowY: 'auto', paddingRight: '0.4rem' }}>
              {(['weapon', 'armor', 'crest'] as const).map((slotType) => {
                const itemsInSlot = AVAILABLE_GEAR.filter((g) => g.slot === slotType);
                const currentlyEquippedItem = equipped[slotType];
                const slotTitle = slotType === 'weapon' ? '🗡️ WEAPON SLOT' : slotType === 'armor' ? '🛡️ ARMOR SLOT' : '👑 CREST SLOT';

                return (
                  <div key={slotType} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-gold)', letterSpacing: '0.08em', marginBottom: '0.55rem' }}>
                      {slotTitle}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.5rem' }}>
                      {itemsInSlot.map((item) => {
                        const isSelected = currentlyEquippedItem?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleEquipItem(item)}
                            onMouseEnter={() => soundFx.playHover()}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              background: isSelected ? 'rgba(16, 185, 129, 0.18)' : 'rgba(0, 0, 0, 0.4)',
                              border: `1.5px solid ${isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
                              borderRadius: '10px',
                              padding: '0.55rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease-in-out',
                              boxShadow: isSelected ? '0 0 14px rgba(16, 185, 129, 0.4)' : 'none',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                <span style={{ fontSize: '0.58rem', fontWeight: 900, color: isSelected ? '#10b981' : 'var(--color-gold)', background: 'rgba(0,0,0,0.5)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                                  {item.rarity}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 900, color: isSelected ? '#10b981' : '#fff', lineHeight: 1.2 }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#facc15', margin: '0.2rem 0' }}>
                                {item.statBonus}
                              </div>
                              <div style={{ fontSize: '0.64rem', color: 'var(--color-text-muted)', lineHeight: 1.2 }}>
                                {item.description}
                              </div>
                            </div>

                            <button
                              className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                              style={{
                                width: '100%',
                                padding: '0.25rem',
                                fontSize: '0.68rem',
                                marginTop: '0.4rem',
                                borderRadius: '6px',
                                background: isSelected ? '#10b981' : 'rgba(255,255,255,0.08)',
                                borderColor: isSelected ? '#34d399' : 'rgba(255,255,255,0.2)',
                                color: isSelected ? '#000' : '#fff',
                              }}
                            >
                              {isSelected ? (
                                <>
                                  <Check size={12} />
                                  <span>EQUIPPED</span>
                                </>
                              ) : (
                                <span>EQUIP</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '0.9rem', textAlign: 'center' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.7rem', fontSize: '0.95rem', borderRadius: '12px', background: '#10b981', borderColor: '#34d399', color: '#000' }}
                onClick={() => {
                  soundFx.playClick();
                  setShowGearModal(false);
                }}
                onMouseEnter={() => soundFx.playHover()}
              >
                <Check size={18} />
                <span>CONFIRM GEAR & CLOSE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
