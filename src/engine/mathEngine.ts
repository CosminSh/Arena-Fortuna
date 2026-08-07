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
    statBonus: '+15 Shield Block & +15 HP',
    damageBonus: 0,
    shieldBonus: 15,
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
    statBonus: '+5 Dmg, +10 Shield, +10 HP',
    damageBonus: 5,
    shieldBonus: 10,
    hpBonus: 10,
    icon: '👑',
    description: 'Crown of the Grand Coliseum Champion.',
    isPremium: true,
  },
];

export const ENEMY_GLADIATORS: Gladiator[] = [
  // Tier 1 / House of the Golden Falcon
  {
    id: 'enemy_decimus',
    name: 'Decimus Iron-Wall',
    title: 'Champion of the 3rd Cohort',
    archetypeId: 'murmillo',
    maxHp: 100,
    currentHp: 100,
    shieldCharges: 12,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Heavy defensive specialist. High shield mitigation.',
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
    buildDescription: 'Aggressive armor-piercer focused on high direct damage.',
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
    shieldCharges: 5,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Disruptive crowd-pleaser using web control.',
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
    shieldCharges: 15,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Veteran arena champion with extra durability and deadly strikes.',
    wins: 34,
    losses: 1,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Gladius of Conquest (+8 Dmg)
    },
  },

  // Tier 2 / Blood Sands Syndicate
  {
    id: 'enemy_crixus',
    name: 'Crixus the Undefeated',
    title: 'Gaulic Heavy Wall',
    archetypeId: 'murmillo',
    maxHp: 105,
    currentHp: 105,
    shieldCharges: 14,
    houseName: 'Blood Sands Syndicate',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Fierce Gaulic warlord with reinforced Scutum shielding.',
    wins: 22,
    losses: 3,
  },
  {
    id: 'enemy_spartacus',
    name: 'Spartacus the Breaker',
    title: 'Liberator of Capua',
    archetypeId: 'thraex',
    maxHp: 105,
    currentHp: 105,
    shieldCharges: 4,
    houseName: 'Blood Sands Syndicate',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Master dual-blade fighter with rapid shield-stripping.',
    wins: 40,
    losses: 0,
    equippedGear: {
      weapon: AVAILABLE_GEAR[2], // Hooked Sica of Viper (+12 Dmg)
    },
  },
  {
    id: 'enemy_gannicus',
    name: 'Gannicus the Shadow',
    title: 'Flamboyant Champion',
    archetypeId: 'retiarius',
    maxHp: 95,
    currentHp: 95,
    shieldCharges: 8,
    houseName: 'Blood Sands Syndicate',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'High risk, high evasion net master.',
    wins: 28,
    losses: 6,
  },
  {
    id: 'enemy_oenomaus',
    name: 'Oenomaus the Doctore',
    title: 'Trainer of Gladiators',
    archetypeId: 'murmillo',
    maxHp: 110,
    currentHp: 110,
    shieldCharges: 16,
    houseName: 'Blood Sands Syndicate',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Impenetrable defense with mastery of counter-strike attrition.',
    wins: 30,
    losses: 4,
    equippedGear: {
      armor: AVAILABLE_GEAR[4], // Imperial Scutum Plate
    },
  },

  // Tier 3 / Crimson Colosseum
  {
    id: 'enemy_priscus',
    name: 'Priscus Net-Binder',
    title: 'Trident Specialist',
    archetypeId: 'retiarius',
    maxHp: 88,
    currentHp: 88,
    shieldCharges: 6,
    houseName: 'Crimson Colosseum',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Specializes in entangling nets and turn disruption.',
    wins: 15,
    losses: 7,
  },
  {
    id: 'enemy_verus',
    name: 'Verus the Crimson',
    title: 'Colosseum Favorite',
    archetypeId: 'thraex',
    maxHp: 98,
    currentHp: 98,
    shieldCharges: 2,
    houseName: 'Crimson Colosseum',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Crowd-favorite curved sica striker.',
    wins: 19,
    losses: 8,
  },
  {
    id: 'enemy_commodus',
    name: 'Emperor Commodus',
    title: 'Self-Proclaimed Hercules',
    archetypeId: 'murmillo',
    maxHp: 120,
    currentHp: 120,
    shieldCharges: 20,
    houseName: 'Crimson Colosseum',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Equipped with royal gilded armor and massive durability.',
    wins: 50,
    losses: 0,
    equippedGear: {
      armor: AVAILABLE_GEAR[4],
      crest: AVAILABLE_GEAR[6],
    },
  },
  {
    id: 'enemy_carpophorus',
    name: 'Carpophorus Beast-Slayer',
    title: 'Bestiarius Legend',
    archetypeId: 'thraex',
    maxHp: 102,
    currentHp: 102,
    shieldCharges: 0,
    houseName: 'Crimson Colosseum',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Vicious offense honed hunting arena lions.',
    wins: 25,
    losses: 3,
  },

  // Tier 4 / Imperial Vanguard
  {
    id: 'enemy_hermeros',
    name: 'Hermeros the Swift',
    title: 'Vanguard Scout',
    archetypeId: 'retiarius',
    maxHp: 85,
    currentHp: 85,
    shieldCharges: 4,
    houseName: 'Imperial Vanguard',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Fast, agile skirmisher with net traps.',
    wins: 12,
    losses: 9,
  },
  {
    id: 'enemy_spiculus',
    name: 'Spiculus the Favored',
    title: 'Nero’s Paladin',
    archetypeId: 'murmillo',
    maxHp: 100,
    currentHp: 100,
    shieldCharges: 10,
    houseName: 'Imperial Vanguard',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Disciplined shield formation tactics.',
    wins: 21,
    losses: 5,
  },
  {
    id: 'enemy_attilius',
    name: 'Marcus Attilius',
    title: 'Rookie Prodigy',
    archetypeId: 'thraex',
    maxHp: 92,
    currentHp: 92,
    shieldCharges: 0,
    houseName: 'Imperial Vanguard',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Unpredictable young duel hero.',
    wins: 9,
    losses: 1,
  },
  {
    id: 'enemy_titurius',
    name: 'Centurion Titurius',
    title: 'Legion Commandant',
    archetypeId: 'murmillo',
    maxHp: 108,
    currentHp: 108,
    shieldCharges: 15,
    houseName: 'Imperial Vanguard',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Iron-clad military veteran with thick shield walls.',
    wins: 27,
    losses: 4,
  },

  // Tier 5 / Iron Serpent Ludus
  {
    id: 'enemy_aurelius',
    name: 'Aurelius Net-Binder',
    title: 'Serpent Trapper',
    archetypeId: 'retiarius',
    maxHp: 90,
    currentHp: 90,
    shieldCharges: 6,
    houseName: 'Iron Serpent Ludus',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Uses venomous net tactics to slow attackers.',
    wins: 16,
    losses: 7,
  },
  {
    id: 'enemy_servilius',
    name: 'Servilius Iron-Fang',
    title: 'Serpent Executioner',
    archetypeId: 'thraex',
    maxHp: 96,
    currentHp: 96,
    shieldCharges: 0,
    houseName: 'Iron Serpent Ludus',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'High critical strike chance blade master.',
    wins: 18,
    losses: 6,
  },
  {
    id: 'enemy_domitius',
    name: 'Domitius Apex',
    title: 'Pinnacle Shield',
    archetypeId: 'murmillo',
    maxHp: 104,
    currentHp: 104,
    shieldCharges: 12,
    houseName: 'Iron Serpent Ludus',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Heavy defensive wall with counter-attack capability.',
    wins: 20,
    losses: 5,
  },
  {
    id: 'enemy_lucius',
    name: 'Lucius Scythe',
    title: 'Reaper of Capua',
    archetypeId: 'thraex',
    maxHp: 100,
    currentHp: 100,
    shieldCharges: 0,
    houseName: 'Iron Serpent Ludus',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Armor-piercing specialist.',
    wins: 23,
    losses: 4,
  },

  // Tier 6 / Legio Invicta Rivals
  {
    id: 'enemy_cassius',
    name: 'Cassius Trident-Grip',
    title: 'Sea Demon',
    archetypeId: 'retiarius',
    maxHp: 94,
    currentHp: 94,
    shieldCharges: 7,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Master of crowd manipulation and net locks.',
    wins: 17,
    losses: 5,
  },
  {
    id: 'enemy_tiberius',
    name: 'Tiberius Titan',
    title: 'The Unshakable',
    archetypeId: 'murmillo',
    maxHp: 112,
    currentHp: 112,
    shieldCharges: 18,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Enormous health pool and massive Scutum shield.',
    wins: 31,
    losses: 2,
  },
  {
    id: 'enemy_valerius',
    name: 'Valerius Blood-Shed',
    title: 'Carnage Champion',
    archetypeId: 'thraex',
    maxHp: 98,
    currentHp: 98,
    shieldCharges: 0,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Fast-paced, aggressive curved blade attacks.',
    wins: 24,
    losses: 7,
  },
  {
    id: 'enemy_septimius',
    name: 'Septimius Tempest',
    title: 'Storm Caster',
    archetypeId: 'retiarius',
    maxHp: 89,
    currentHp: 89,
    shieldCharges: 5,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Relentless control strategy with free rerolls.',
    wins: 14,
    losses: 6,
  },
  {
    id: 'enemy_antoninus',
    name: 'Antoninus Executioner',
    title: 'The Pit Cleaver',
    archetypeId: 'thraex',
    maxHp: 104,
    currentHp: 104,
    shieldCharges: 0,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Strips shield defense with razor precision.',
    wins: 26,
    losses: 4,
  },
  {
    id: 'enemy_claudius',
    name: 'Claudius Bastion',
    title: 'Fortress Guardian',
    archetypeId: 'murmillo',
    maxHp: 106,
    currentHp: 106,
    shieldCharges: 14,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'High shield absorption and attrition.',
    wins: 22,
    losses: 5,
  },
  {
    id: 'enemy_rufus',
    name: 'Rufus Net-Caster',
    title: 'Sand Entangler',
    archetypeId: 'retiarius',
    maxHp: 91,
    currentHp: 91,
    shieldCharges: 6,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Disrupts enemy attacks with entangling nets.',
    wins: 13,
    losses: 8,
  },
  {
    id: 'enemy_drusus',
    name: 'Drusus Gladius',
    title: 'Iron Sword Master',
    archetypeId: 'thraex',
    maxHp: 97,
    currentHp: 97,
    shieldCharges: 0,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Consistent direct damage output.',
    wins: 19,
    losses: 6,
  },
  {
    id: 'enemy_felix',
    name: 'Felix Fortunatus',
    title: 'The Lucky Blade',
    archetypeId: 'murmillo',
    maxHp: 100,
    currentHp: 100,
    shieldCharges: 10,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Balanced defense and steady attack pattern.',
    wins: 16,
    losses: 6,
  },
  {
    id: 'enemy_maximus',
    name: 'Maximus Decimus Meridius',
    title: 'Commander of the Northern Armies',
    archetypeId: 'thraex',
    maxHp: 125,
    currentHp: 125,
    shieldCharges: 15,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Grand Arena Legend equipped with Mythic Laurel and Viper Sica.',
    wins: 60,
    losses: 0,
    equippedGear: {
      weapon: AVAILABLE_GEAR[2],
      crest: AVAILABLE_GEAR[6],
    },
  },
];

export function getRandomScoutingTargets(count: number = 4): Gladiator[] {
  const shuffled = [...ENEMY_GLADIATORS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


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

export function evaluateCombination(
  reels: SymbolType[],
  chosenWildSymbol?: SymbolType
): CombinationResult {
  const nonWilds = reels.filter((s) => s !== 'wild');
  const wildCount = reels.length - nonWilds.length;

  if (wildCount === 3) {
    const symbolToUse = chosenWildSymbol || 'sword';
    return {
      matchCount: 3,
      primarySymbol: symbolToUse,
      hasWild: true,
      rawSymbols: reels,
      description: `TRIPLE WILD JACKPOT (${symbolToUse.toUpperCase()})! Critical Strike.`,
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

  if (chosenWildSymbol && wildCount > 0) {
    bestSymbol = chosenWildSymbol;
  }

  const effectiveMatch = (counts[bestSymbol] || 0) + wildCount;

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
  firstNetUsed: boolean,
  chosenWildSymbol?: SymbolType
): {
  outcome: TurnOutcome;
  updatedFirstNetUsed: boolean;
  updatedAttackerShields: number;
  updatedDefenderShields: number;
} {
  const combination = evaluateCombination(reels, chosenWildSymbol);
  const attackerArchetype = ARCHETYPES[attacker.archetypeId];

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
    if (matchCount === 3) shieldGranted = 22 + gearShieldBonus;
    else if (matchCount === 2) shieldGranted = 14 + gearShieldBonus;
    else shieldGranted = 4;

    if (attacker.archetypeId === 'murmillo') {
      shieldGranted = Math.round(shieldGranted * 1.25);
      abilityTriggered = 'Scutum Wall (+25% Shield)';
    }
  } else if (primarySymbol === 'class') {
    abilityTriggered = `${attackerArchetype.name}: ${attackerArchetype.abilityName}`;

    if (attacker.archetypeId === 'murmillo') {
      if (matchCount === 3) {
        shieldGranted = 25 + gearShieldBonus;
        rawDamage = 15 + gearDamageBonus;
      } else if (matchCount === 2) {
        shieldGranted = 15 + gearShieldBonus;
        rawDamage = 10 + gearDamageBonus;
      } else {
        shieldGranted = 4;
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

  // Calculate Shield Absorption on Defender
  let shieldBlocked = 0;
  let remainingDamage = rawDamage;

  if (defender.shieldCharges > 0 && remainingDamage > 0) {
    const absorblem = Math.max(0, remainingDamage - piercedDamage);
    shieldBlocked = Math.min(defender.shieldCharges, absorblem);
    remainingDamage = Math.max(0, remainingDamage - shieldBlocked);
  }

  netDamage = Math.max(0, Math.round(remainingDamage));
  const updatedDefenderHp = Math.max(0, defender.currentHp - netDamage);

  const maxShieldCap = attacker.archetypeId === 'murmillo' ? 30 : 22;
  const updatedAttackerShields = Math.min(maxShieldCap, attacker.shieldCharges + shieldGranted);
  const updatedDefenderShields = Math.max(0, defender.shieldCharges - shieldBlocked);

  let logMessage = `${attacker.name} rolled [${reels.map((r) => r.toUpperCase()).join(' | ')}].`;
  if (netDamage > 0 || shieldBlocked > 0) {
    if (shieldBlocked > 0) logMessage += ` Shield absorbed ${shieldBlocked} DMG!`;
    if (netDamage > 0) logMessage += ` Dealt ${netDamage} HP damage`;
    if (piercedDamage > 0) logMessage += ` [${piercedDamage} pierced]`;
    logMessage += `.`;
  } else if (shieldGranted > 0) {
    logMessage += ` Raised +${shieldGranted} shield protection!`;
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

  return {
    outcome,
    updatedFirstNetUsed: newFirstNetUsed,
    updatedAttackerShields,
    updatedDefenderShields,
  };
}

export function simulateMatchup(
  player: Gladiator,
  enemy: Gladiator,
  simulations: number = 1000
): { playerWinRate: number; enemyWinRate: number; averageTurns: number } {
  let playerWins = 0;
  let totalTurns = 0;

  for (let i = 0; i < simulations; i++) {
    const simPlayer: Gladiator = { ...player, currentHp: player.maxHp, shieldCharges: player.shieldCharges || 0 };
    const simEnemy: Gladiator = { ...enemy, currentHp: enemy.maxHp, shieldCharges: enemy.shieldCharges || 0 };

    let turn = 1;
    let activeEntangledPlayer = false;
    let activeEntangledEnemy = false;
    let firstNetUsedPlayer = false;
    let firstNetUsedEnemy = false;

    while (turn <= 8 && simPlayer.currentHp > 0 && simEnemy.currentHp > 0) {
      // 1. Player Turn
      const playerTurn = resolveTurn(
        turn,
        simPlayer,
        simEnemy,
        spinReels(),
        activeEntangledPlayer,
        firstNetUsedEnemy
      );

      firstNetUsedEnemy = playerTurn.updatedFirstNetUsed;
      simEnemy.currentHp = Math.max(0, simEnemy.currentHp - playerTurn.outcome.netDamage);
      simEnemy.shieldCharges = playerTurn.updatedDefenderShields;
      simPlayer.shieldCharges = playerTurn.updatedAttackerShields;

      if (playerTurn.outcome.debuffApplied) activeEntangledEnemy = true;
      else activeEntangledEnemy = false;
      activeEntangledPlayer = false;

      if (simEnemy.currentHp <= 0) break;

      // 2. Enemy Turn
      const enemyTurn = resolveTurn(
        turn,
        simEnemy,
        simPlayer,
        spinReels(),
        activeEntangledEnemy,
        firstNetUsedPlayer
      );

      firstNetUsedPlayer = enemyTurn.updatedFirstNetUsed;
      simPlayer.currentHp = Math.max(0, simPlayer.currentHp - enemyTurn.outcome.netDamage);
      simPlayer.shieldCharges = enemyTurn.updatedDefenderShields;
      simEnemy.shieldCharges = enemyTurn.updatedAttackerShields;

      if (enemyTurn.outcome.debuffApplied) activeEntangledPlayer = true;

      if (simPlayer.currentHp <= 0) break;

      turn++;
    }

    if (simPlayer.currentHp > simEnemy.currentHp) {
      playerWins++;
    }
    totalTurns += Math.min(turn, 8);
  }

  const playerWinRate = Math.round((playerWins / simulations) * 100);
  const enemyWinRate = 100 - playerWinRate;
  const averageTurns = Number((totalTurns / simulations).toFixed(1));

  return { playerWinRate, enemyWinRate, averageTurns };
}
