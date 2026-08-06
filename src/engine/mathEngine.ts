import { Archetype, ArchetypeId, Gladiator, SymbolType, CombinationResult, TurnOutcome, GearItem } from '../types/game';

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  murmillo: {
    id: 'murmillo',
    name: 'Murmillo',
    subName: 'The Shield',
    weapon: 'Gladius',
    shield: 'Scutum',
    abilityName: 'Scutum Wall',
    abilityDesc: 'Shield symbols block +25% damage. The first Net effect received in battle is reduced by half.',
    identity: 'Reliable defense, damage reduction, and attrition.',
    icon: '🛡️',
    portrait: './assets/murmillo.png',
    favoredAgainst: 'retiarius',
    weakAgainst: 'thraex',
  },
  thraex: {
    id: 'thraex',
    name: 'Thraex',
    subName: 'The Hooked Blade',
    weapon: 'Sica Blade',
    shield: 'Parma',
    abilityName: 'Hooked Blade',
    abilityDesc: '25% of Sword damage ignores Shields. Two Sword symbols remove 1 enemy Shield charge.',
    identity: 'Precision offense and shield-piercing attacks.',
    icon: '🗡️',
    portrait: './assets/thraex.png',
    favoredAgainst: 'murmillo',
    weakAgainst: 'retiarius',
  },
  retiarius: {
    id: 'retiarius',
    name: 'Retiarius',
    subName: 'The Net',
    weapon: 'Trident',
    shield: 'Net & Manica',
    abilityName: 'Entangling Net',
    abilityDesc: 'Matching 2 Net symbols applies Entangled (-30% enemy next dmg). Matching 3 Net symbols grants a free reroll.',
    identity: 'Disruption, control, reach, and high-risk attacks.',
    icon: '🕸️',
    portrait: './assets/retiarius.png',
    favoredAgainst: 'thraex',
    weakAgainst: 'murmillo',
  },
};

export const AVAILABLE_GEAR: GearItem[] = [
  // Weapons
  {
    id: 'wep_1',
    name: 'Standard Iron Blade',
    slot: 'weapon',
    rarity: 'Common',
    statBonus: '+0 Damage',
    damageBonus: 0,
    shieldBonus: 0,
    hpBonus: 0,
    icon: '🗡️',
    description: 'Basic arena issue gladius.',
  },
  {
    id: 'wep_2',
    name: 'Gladius of Conquest',
    slot: 'weapon',
    rarity: 'Legendary',
    statBonus: '+8 Sword Damage',
    damageBonus: 8,
    shieldBonus: 0,
    hpBonus: 0,
    icon: '⚔️',
    description: 'Tempered steel forged for high direct damage.',
    isPremium: true,
  },
  {
    id: 'wep_3',
    name: 'Hooked Sica of the Viper',
    slot: 'weapon',
    rarity: 'Mythic',
    statBonus: '+12 Damage & Piercing',
    damageBonus: 12,
    shieldBonus: 0,
    hpBonus: 0,
    icon: '🩸',
    description: 'Vicious curved blade designed to strip shield armor.',
    isPremium: true,
  },

  // Armor
  {
    id: 'armor_1',
    name: 'Leather Manica',
    slot: 'armor',
    rarity: 'Common',
    statBonus: '+0 Shield',
    damageBonus: 0,
    shieldBonus: 0,
    hpBonus: 0,
    icon: '🛡️',
    description: 'Standard leather arm guard.',
  },
  {
    id: 'armor_2',
    name: 'Imperial Scutum Plate',
    slot: 'armor',
    rarity: 'Legendary',
    statBonus: '+10 Shield Block & +15 HP',
    damageBonus: 0,
    shieldBonus: 10,
    hpBonus: 15,
    icon: '🏰',
    description: 'Heavy bronze plate boosting maximum durability.',
    isPremium: true,
  },

  // Crests / Banners
  {
    id: 'crest_1',
    name: 'Standard House Ribbon',
    slot: 'crest',
    rarity: 'Common',
    statBonus: '+0 Stats',
    damageBonus: 0,
    shieldBonus: 0,
    hpBonus: 0,
    icon: '🚩',
    description: 'Basic recruitment banner.',
  },
  {
    id: 'crest_2',
    name: "Champion's Golden Laurel",
    slot: 'crest',
    rarity: 'Mythic',
    statBonus: '+5 Dmg, +5 Shield, +10 HP',
    damageBonus: 5,
    shieldBonus: 5,
    hpBonus: 10,
    icon: '👑',
    description: 'Crown of the Grand Coliseum Champion.',
    isPremium: true,
  },
];

export const ENEMY_GLADIATORS: Gladiator[] = [
  {
    id: 'enemy_decimus',
    name: 'Decimus Iron-Wall',
    title: 'Champion of the 3rd Cohort',
    archetypeId: 'murmillo',
    maxHp: 100,
    currentHp: 100,
    shieldCharges: 0,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Heavy defensive specialist. High shield mitigation and counter-attrition strategy.',
    wins: 14,
    losses: 2,
  },
  {
    id: 'enemy_varia',
    name: 'Varia the Viper',
    title: 'The Unbroken Blade',
    archetypeId: 'thraex',
    maxHp: 95,
    currentHp: 95,
    shieldCharges: 0,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Aggressive armor-piercer focused on high direct damage and stripping enemy shields.',
    wins: 18,
    losses: 5,
  },
  {
    id: 'enemy_batiatus',
    name: 'Batiatus Net-Master',
    title: 'The Pit Disruptor',
    archetypeId: 'retiarius',
    maxHp: 90,
    currentHp: 90,
    shieldCharges: 0,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Disruptive crowd-pleaser using web control to lock down heavy attackers.',
    wins: 11,
    losses: 4,
  },
  {
    id: 'enemy_flamma',
    name: 'Flamma the Immortal',
    title: 'Arena Grandmaster',
    archetypeId: 'thraex',
    maxHp: 110,
    currentHp: 110,
    shieldCharges: 0,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Veteran arena champion with extra durability and deadly counter-strikes.',
    wins: 34,
    losses: 1,
  },
];

export function getRandomSymbol(): SymbolType {
  const rand = Math.random() * 100;
  if (rand < 35) return 'sword';
  if (rand < 65) return 'shield';
  if (rand < 90) return 'class';
  return 'wild';
}

export function spinReels(): SymbolType[] {
  return [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
}

export function evaluateCombination(reels: SymbolType[]): CombinationResult {
  const nonWilds = reels.filter((s) => s !== 'wild');
  const wildCount = reels.length - nonWilds.length;

  if (wildCount === 3) {
    return {
      matchCount: 3,
      primarySymbol: 'sword',
      hasWild: true,
      rawSymbols: reels,
      description: 'TRIPLE WILD JACKPOT! Critical Strike.',
      tier: 'jackpot',
    };
  }

  const counts: Record<string, number> = {};
  for (const s of nonWilds) {
    counts[s] = (counts[s] || 0) + 1;
  }

  let bestSymbol: SymbolType = nonWilds[0] || 'sword';
  let maxFreq = 0;
  for (const [sym, freq] of Object.entries(counts)) {
    if (freq > maxFreq) {
      maxFreq = freq;
      bestSymbol = sym as SymbolType;
    }
  }

  const effectiveMatch = maxFreq + wildCount;

  if (effectiveMatch >= 3) {
    return {
      matchCount: 3,
      primarySymbol: bestSymbol,
      hasWild: wildCount > 0,
      rawSymbols: reels,
      description: `3-OF-A-KIND ${bestSymbol.toUpperCase()} JACKPOT!`,
      tier: 'jackpot',
    };
  } else if (effectiveMatch === 2) {
    return {
      matchCount: 2,
      primarySymbol: bestSymbol,
      hasWild: wildCount > 0,
      rawSymbols: reels,
      description: `2-OF-A-KIND ${bestSymbol.toUpperCase()}.`,
      tier: 'common',
    };
  } else {
    return {
      matchCount: 1,
      primarySymbol: nonWilds[0] || 'sword',
      hasWild: false,
      rawSymbols: reels,
      description: 'NO MATCH! Low effect.',
      tier: 'fumble',
    };
  }
}

export function resolveTurn(
  turnNumber: number,
  attacker: Gladiator,
  defender: Gladiator,
  reels: SymbolType[],
  activeEntangled: boolean,
  firstNetUsed: boolean
): { outcome: TurnOutcome; updatedFirstNetUsed: boolean } {
  const combination = evaluateCombination(reels);
  const attackerArchetype = ARCHETYPES[attacker.archetypeId];

  // Calculate equipped gear stat bonuses
  let gearDamageBonus = 0;
  let gearShieldBonus = 0;
  if (attacker.equippedGear) {
    if (attacker.equippedGear.weapon) gearDamageBonus += attacker.equippedGear.weapon.damageBonus;
    if (attacker.equippedGear.armor) gearShieldBonus += attacker.equippedGear.armor.shieldBonus;
    if (attacker.equippedGear.crest) {
      gearDamageBonus += attacker.equippedGear.crest.damageBonus;
      gearShieldBonus += attacker.equippedGear.crest.shieldBonus;
    }
  }

  const hasTriangleAdvantage = attackerArchetype.favoredAgainst === defender.archetypeId;
  const triangleMultiplier = hasTriangleAdvantage ? 1.15 : 1.0;

  let rawDamage = 0;
  let shieldGranted = 0;
  let piercedDamage = 0;
  let netDamage = 0;
  let abilityTriggered: string | null = null;
  let debuffApplied: string | null = null;
  let rerollGranted = false;
  let newFirstNetUsed = firstNetUsed;

  const { primarySymbol, matchCount } = combination;

  if (primarySymbol === 'sword') {
    if (matchCount === 3) rawDamage = Math.round((40 + gearDamageBonus) * triangleMultiplier);
    else if (matchCount === 2) rawDamage = Math.round((25 + gearDamageBonus) * triangleMultiplier);
    else rawDamage = Math.round((10 + gearDamageBonus) * triangleMultiplier);
  } else if (primarySymbol === 'shield') {
    if (matchCount === 3) shieldGranted = 35 + gearShieldBonus;
    else if (matchCount === 2) shieldGranted = 20 + gearShieldBonus;
    else shieldGranted = 8;

    if (attacker.archetypeId === 'murmillo') {
      shieldGranted = Math.round(shieldGranted * 1.25);
      abilityTriggered = 'Scutum Wall (+25% Shield)';
    }
  } else if (primarySymbol === 'class') {
    abilityTriggered = `${attackerArchetype.name}: ${attackerArchetype.abilityName}`;

    if (attacker.archetypeId === 'murmillo') {
      if (matchCount === 3) {
        shieldGranted = 45 + gearShieldBonus;
        rawDamage = 15 + gearDamageBonus;
      } else if (matchCount === 2) {
        shieldGranted = 25 + gearShieldBonus;
        rawDamage = 10 + gearDamageBonus;
      } else {
        shieldGranted = 10;
      }
    } else if (attacker.archetypeId === 'thraex') {
      if (matchCount === 3) {
        rawDamage = Math.round((45 + gearDamageBonus) * triangleMultiplier);
        piercedDamage = Math.round(rawDamage * 0.4);
      } else if (matchCount === 2) {
        rawDamage = Math.round((28 + gearDamageBonus) * triangleMultiplier);
        piercedDamage = Math.round(rawDamage * 0.25);
      } else {
        rawDamage = 12;
      }
    } else if (attacker.archetypeId === 'retiarius') {
      if (matchCount === 3) {
        rawDamage = Math.round((35 + gearDamageBonus) * triangleMultiplier);
        debuffApplied = 'Entangled (-30% enemy next dmg)';
        rerollGranted = true;
      } else if (matchCount === 2) {
        rawDamage = Math.round((22 + gearDamageBonus) * triangleMultiplier);
        debuffApplied = 'Entangled (-30% enemy next dmg)';
      } else {
        rawDamage = 10;
      }
    }
  }

  if (attacker.archetypeId === 'thraex' && primarySymbol === 'sword') {
    piercedDamage = Math.round(rawDamage * 0.25);
  }

  if (activeEntangled) {
    let reduction = 0.3;
    if (attacker.archetypeId === 'murmillo' && !firstNetUsed) {
      reduction = 0.15;
      newFirstNetUsed = true;
      abilityTriggered = (abilityTriggered ? abilityTriggered + ' | ' : '') + 'Resisted 50% Net';
    }
    rawDamage = Math.round(rawDamage * (1 - reduction));
  }

  let shieldBlocked = 0;
  let remainingDamage = rawDamage;

  if (defender.shieldCharges > 0 && remainingDamage > 0) {
    const shieldAbsorb = Math.min(defender.shieldCharges, remainingDamage - piercedDamage);
    shieldBlocked = Math.max(0, Math.round(shieldAbsorb));
    remainingDamage = Math.max(0, remainingDamage - shieldBlocked);
  }

  netDamage = Math.max(0, Math.round(remainingDamage));
  const updatedDefenderHp = Math.max(0, defender.currentHp - netDamage);

  let logMessage = `${attacker.name} rolled [${reels.map(r => r.toUpperCase()).join(' | ')}].`;
  if (netDamage > 0) {
    logMessage += ` Dealt ${netDamage} HP damage`;
    if (shieldBlocked > 0) logMessage += ` (${shieldBlocked} blocked)`;
    if (piercedDamage > 0) logMessage += ` [${piercedDamage} pierced]`;
    logMessage += `.`;
  } else if (shieldGranted > 0) {
    logMessage += ` Gained +${shieldGranted} shield protection.`;
  }
  if (debuffApplied) logMessage += ` Applied ${debuffApplied}!`;

  const outcome: TurnOutcome = {
    turnNumber,
    attackerId: attacker.id,
    attackerName: attacker.name,
    defenderId: defender.id,
    defenderName: defender.name,
    reels,
    combination,
    rawDamage,
    shieldBlocked,
    piercedDamage,
    netDamage,
    abilityTriggered,
    debuffApplied,
    rerollGranted,
    attackerHpAfter: attacker.currentHp,
    defenderHpAfter: updatedDefenderHp,
    logMessage,
  };

  return { outcome, updatedFirstNetUsed: newFirstNetUsed };
}
