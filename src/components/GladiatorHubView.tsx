import React, { useState } from 'react';
import { ArchetypeId, GearItem } from '../types/game';
import { ARCHETYPES, AVAILABLE_GEAR, getGearStats } from '../engine/mathEngine';
import { soundFx } from '../engine/audioEngine';
import { loadPlayerProfile, updatePlayerName } from '../engine/storageEngine';
import { ArrowLeft, Shield, Swords, Sparkles, Crown, Check, Zap, Edit3 } from 'lucide-react';

interface GladiatorHubViewProps {
  currentArchetypeId: ArchetypeId;
  equippedGear: { weapon?: GearItem; armor?: GearItem; crest?: GearItem };
  onUpdateGladiator: (archetypeId: ArchetypeId, gear: { weapon?: GearItem; armor?: GearItem; crest?: GearItem }) => void;
  onBack: () => void;
}

export const GladiatorHubView: React.FC<GladiatorHubViewProps> = ({
  currentArchetypeId,
  equippedGear: initialGear,
  onUpdateGladiator,
  onBack,
}) => {
  const [selectedArchId, setSelectedArchId] = useState<ArchetypeId>(currentArchetypeId);
  const [gearLoadout, setGearLoadout] = useState(initialGear);
  const [playerName, setPlayerNameState] = useState<string>(() => loadPlayerProfile().playerName || 'Imperator');

  const arch = ARCHETYPES[selectedArchId];

  const handleSelectGear = (gear: GearItem) => {
    soundFx.playEquip();
    setGearLoadout((prev) => ({
      ...prev,
      [gear.slot]: gear,
    }));
  };

  const handleSave = () => {
    soundFx.playClick();
    updatePlayerName(playerName);
    onUpdateGladiator(selectedArchId, gearLoadout);
    onBack();
  };

  const gearStats = getGearStats(gearLoadout);
  const totalDmgBonus = gearStats.damageBonus;
  const totalShieldBonus = gearStats.shieldBonus;
  const totalHpBonus = gearStats.hpBonus;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.45rem',
        backgroundImage: 'linear-gradient(180deg, rgba(6, 8, 13, 0.7) 0%, rgba(6, 8, 13, 0.95) 100%), url("./assets/armory_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0.5rem',
        borderRadius: '16px',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          onMouseEnter={() => soundFx.playHover()}
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', textAlign: 'center', margin: 0 }}>GLADIATOR ARMORY</h2>
        <div style={{ width: '60px' }}></div>
      </div>

      {/* 2. Hero Overview Bar */}
      <div className="card" style={{ padding: '0.5rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderColor: 'var(--color-gold)', flexShrink: 0 }}>
        <img
          src={arch.portrait}
          alt={arch.name}
          style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--color-gold)', objectFit: 'cover', flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
            <Edit3 size={14} color="var(--color-gold)" />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerNameState(e.target.value)}
              placeholder="Enter Gladiator Name..."
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1.5px solid var(--color-gold)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.92rem',
                fontWeight: 900,
                padding: '0.2rem 0.5rem',
                width: '100%',
                maxWidth: '200px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-gold)', fontWeight: 700 }}>
            {arch.name} ({arch.subName})
          </div>
        </div>

        {/* Stats Pill */}
        <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.72rem', background: 'rgba(0,0,0,0.7)', padding: '0.35rem 0.7rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
          <span style={{ color: '#ef4444' }}>⚔️ +{totalDmgBonus}</span>
          <span style={{ color: '#3b82f6' }}>🛡️ +{totalShieldBonus}</span>
          <span style={{ color: '#10b981' }}>❤️ +{totalHpBonus} HP</span>
        </div>
      </div>

      {/* 3. Archetype Class Selector Pills */}
      <div style={{ flexShrink: 0 }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', display: 'block' }}>
          Select Class Archetype
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
          {(Object.keys(ARCHETYPES) as ArchetypeId[]).map((id) => {
            const item = ARCHETYPES[id];
            const isSelected = id === selectedArchId;
            return (
              <button
                key={id}
                className="btn"
                style={{
                  padding: '0.4rem',
                  fontSize: '0.78rem',
                  background: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.5)',
                  borderColor: isSelected ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.15)',
                  color: isSelected ? '#fff' : 'var(--color-text-muted)',
                }}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedArchId(id);
                }}
                onMouseEnter={() => soundFx.playHover()}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Equipment Gear Shop Catalog (Scrollable) */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          paddingRight: '0.3rem',
        }}
      >
        {(['weapon', 'armor', 'crest'] as const).map((slotType) => {
          const slotTitle = slotType === 'weapon' ? '⚔️ WEAPONS (Attack Strategy)' : slotType === 'armor' ? '🛡️ ARMOR (Defense Strategy)' : '🚩 CRESTS & BANNERS (Build Synergy)';
          const slotItems = AVAILABLE_GEAR.filter((g) => g.slot === slotType);

          return (
            <div key={slotType} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {slotTitle}
              </span>

              {slotItems.map((item) => {
                const isEquipped = gearLoadout[item.slot]?.id === item.id;
                const rarityColor = item.rarity === 'Mythic' ? '#c084fc' : item.rarity === 'Legendary' ? '#f59e0b' : '#60a5fa';
                return (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '0.55rem 0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderColor: isEquipped ? '#10b981' : 'rgba(255, 255, 255, 0.14)',
                      background: isEquipped ? 'rgba(16, 185, 129, 0.16)' : 'rgba(12, 16, 24, 0.85)',
                      transition: 'all 0.15s ease-in-out',
                    }}
                    onMouseEnter={() => soundFx.playHover()}
                    onClick={() => handleSelectGear(item)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#fff' }}>{item.name}</span>
                          <span style={{ fontSize: '0.58rem', color: rarityColor, border: `1px solid ${rarityColor}`, padding: '0.05rem 0.35rem', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                            {item.rarity}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, marginTop: '0.1rem' }}>{item.statBonus}</div>
                        <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.1rem', fontStyle: 'italic' }}>{item.description}</div>
                      </div>
                    </div>

                    <button
                      className={`btn ${isEquipped ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', marginLeft: '0.5rem', flexShrink: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectGear(item);
                      }}
                      onMouseEnter={() => soundFx.playHover()}
                    >
                      {isEquipped ? <Check size={14} color="#10b981" /> : 'EQUIP'}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 5. Save & Confirm Button */}
      <button
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.7rem', fontSize: '0.98rem', flexShrink: 0 }}
        onClick={handleSave}
        onMouseEnter={() => soundFx.playHover()}
      >
        <Check size={18} />
        <span>SAVE BUILD & DEPLOY</span>
      </button>
    </div>
  );
};
