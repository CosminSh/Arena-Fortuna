import React, { useState } from 'react';
import { ArchetypeId, GearItem } from '../types/game';
import { ARCHETYPES, AVAILABLE_GEAR } from '../engine/mathEngine';
import { ArrowLeft, Shield, Swords, Sparkles, Crown, Check, Zap } from 'lucide-react';

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

  const arch = ARCHETYPES[selectedArchId];

  const handleSelectGear = (gear: GearItem) => {
    setGearLoadout((prev) => ({
      ...prev,
      [gear.slot]: gear,
    }));
  };

  const handleSave = () => {
    onUpdateGladiator(selectedArchId, gearLoadout);
    onBack();
  };

  const totalDmgBonus = (gearLoadout.weapon?.damageBonus || 0) + (gearLoadout.crest?.damageBonus || 0);
  const totalShieldBonus = (gearLoadout.armor?.shieldBonus || 0) + (gearLoadout.crest?.shieldBonus || 0);
  const totalHpBonus = (gearLoadout.armor?.hpBonus || 0) + (gearLoadout.crest?.hpBonus || 0);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.4rem',
        backgroundImage: 'linear-gradient(180deg, rgba(6, 8, 13, 0.7) 0%, rgba(6, 8, 13, 0.95) 100%), url("./assets/armory_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0.5rem',
        borderRadius: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>
        <h2 style={{ fontSize: '1.2rem', color: '#fff', textAlign: 'center' }}>GLADIATOR ARMORY</h2>
        <div style={{ width: '60px' }}></div>
      </div>

      {/* Hero Overview Bar */}
      <div className="card" style={{ padding: '0.6rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderColor: 'var(--color-gold)' }}>
        <img
          src={arch.portrait}
          alt={arch.name}
          style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid var(--color-gold)', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff' }}>Imperator</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-gold)', fontWeight: 700 }}>
            {arch.name} ({arch.subName})
          </div>
        </div>

        {/* Stats Pill */}
        <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.72rem', background: 'rgba(0,0,0,0.7)', padding: '0.35rem 0.7rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ color: '#ef4444' }}>⚔️ +{totalDmgBonus}</span>
          <span style={{ color: '#3b82f6' }}>🛡️ +{totalShieldBonus}</span>
          <span style={{ color: '#10b981' }}>❤️ +{totalHpBonus} HP</span>
        </div>
      </div>

      {/* Archetype Class Selector Pills */}
      <div>
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
                  padding: '0.45rem',
                  fontSize: '0.78rem',
                  background: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0, 0, 0, 0.5)',
                  borderColor: isSelected ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.15)',
                  color: isSelected ? '#fff' : 'var(--color-text-muted)',
                }}
                onClick={() => setSelectedArchId(id)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Gear Shop Catalog */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
          Armory Loadout (Boost Combat Stats)
        </span>

        {AVAILABLE_GEAR.map((item) => {
          const isEquipped = gearLoadout[item.slot]?.id === item.id;
          return (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '0.5rem 0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderColor: isEquipped ? '#10b981' : 'rgba(255, 255, 255, 0.12)',
                background: isEquipped ? 'rgba(16, 185, 129, 0.15)' : 'rgba(12, 16, 24, 0.85)',
              }}
              onClick={() => handleSelectGear(item)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>{item.name}</span>
                    {item.isPremium && (
                      <span style={{ fontSize: '0.6rem', background: '#d97706', color: '#000', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 900 }}>
                        PASS
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>{item.statBonus}</span>
                </div>
              </div>

              <button
                className={`btn ${isEquipped ? 'btn-secondary' : 'btn-primary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectGear(item);
                }}
              >
                {isEquipped ? <Check size={14} color="#10b981" /> : 'EQUIP'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Save & Confirm Button */}
      <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }} onClick={handleSave}>
        <Check size={18} />
        <span>SAVE BUILD & DEPLOY</span>
      </button>
    </div>
  );
};
