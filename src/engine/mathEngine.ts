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
  // --- WEAPONS ---
  {
    id: 'wep_gladius',
    name: 'Gladius of Invicta',
    slot: 'weapon',
    rarity: 'Rare',
    statBonus: '+8 Dmg, +4 Shield Armor',
    damageBonus: 8,
    shieldBonus: 4,
    hpBonus: 0,
    icon: '⚔️',
    description: 'Tempered Roman steel providing balanced offense and parrying stance.',
  },
  {
    id: 'wep_sica',
    name: 'Hooked Sica of the Viper',
    slot: 'weapon',
    rarity: 'Mythic',
    statBonus: '+15 Direct Damage',
    damageBonus: 15,
    shieldBonus: 0,
    hpBonus: 0,
    icon: '🩸',
    description: 'Vicious curved blade designed to strip rival defense with raw burst power.',
  },
  {
    id: 'wep_trident',
    name: 'Retiarius Weighted Trident',
    slot: 'weapon',
    rarity: 'Legendary',
    statBonus: '+6 Dmg, +8 Shield, +10 HP',
    damageBonus: 6,
    shieldBonus: 8,
    hpBonus: 10,
    icon: '🔱',
    description: 'Versatile long-range prongs balancing tactical control and survivability.',
  },

  // --- ARMOR ---
  {
    id: 'armor_scutum',
    name: 'Imperial Scutum Guard',
    slot: 'armor',
    rarity: 'Legendary',
    statBonus: '+16 Shield Armor, +10 Max HP',
    damageBonus: 0,
    shieldBonus: 16,
    hpBonus: 10,
    icon: '🏰',
    description: 'Heavy bronze plate boosting maximum shield mitigation for tank builds.',
  },
  {
    id: 'armor_lorica',
    name: 'Centurion Lorica Hamata',
    slot: 'armor',
    rarity: 'Rare',
    statBonus: '+25 Max HP, +6 Shield Armor',
    damageBonus: 0,
    shieldBonus: 6,
    hpBonus: 25,
    icon: '🛡️',
    description: 'Reinforced chainmail maximizing your gladiator overall health pool.',
  },
  {
    id: 'armor_galerus',
    name: 'Light Feathered Galerus',
    slot: 'armor',
    rarity: 'Mythic',
    statBonus: '+8 Dmg, +10 Shield Armor',
    damageBonus: 8,
    shieldBonus: 10,
    hpBonus: 0,
    icon: '🦅',
    description: 'Agile shoulder guard enabling rapid counter-strikes without slowing tempo.',
  },

  // --- CRESTS / BANNERS ---
  {
    id: 'crest_laurel',
    name: "Champion's Golden Laurel",
    slot: 'crest',
    rarity: 'Mythic',
    statBonus: '+6 Dmg, +8 Shield, +12 Max HP',
    damageBonus: 6,
    shieldBonus: 8,
    hpBonus: 12,
    icon: '👑',
    description: 'Golden crown awarded to victorious Coliseum champions.',
  },
  {
    id: 'crest_mars',
    name: 'Warhorn Crest of Mars',
    slot: 'crest',
    rarity: 'Legendary',
    statBonus: '+10 Damage, +5 Max HP',
    damageBonus: 10,
    shieldBonus: 0,
    hpBonus: 5,
    icon: '🔥',
    description: 'Crimson plume of Mars inspiring relentless offensive strike power.',
  },
  {
    id: 'crest_aegis',
    name: 'Aegis Banner of Invicta',
    slot: 'crest',
    rarity: 'Rare',
    statBonus: '+12 Shield Armor, +15 Max HP',
    damageBonus: 0,
    shieldBonus: 12,
    hpBonus: 15,
    icon: '🚩',
    description: 'Sacred legionary banner granting massive defensive resilience.',
  },
];

export interface GearStats {
  damageBonus: number;
  shieldBonus: number;
  hpBonus: number;
}

export function getGearStats(equippedGear?: { weapon?: GearItem; armor?: GearItem; crest?: GearItem }): GearStats {
  let damageBonus = 0;
  let shieldBonus = 0;
  let hpBonus = 0;

  if (equippedGear) {
    (['weapon', 'armor', 'crest'] as const).forEach((slot) => {
      const item = equippedGear[slot];
      if (item) {
        if (item.damageBonus) damageBonus += item.damageBonus;
        if (item.shieldBonus) shieldBonus += item.shieldBonus;
        if (item.hpBonus) hpBonus += item.hpBonus;
      }
    });
  }

  return { damageBonus, shieldBonus, hpBonus };
}

export const ENEMY_GLADIATORS: Gladiator[] = [
  // --- TIER 1 / HOUSE OF THE GOLDEN FALCON ---
  {
    id: 'enemy_decimus',
    name: 'Decimus Iron-Wall',
    title: 'Champion of the 3rd Cohort',
    archetypeId: 'murmillo',
    maxHp: 125,
    currentHp: 125,
    shieldCharges: 16,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Heavy defensive specialist with gladius, scutum guard & mars crest.',
    wins: 14,
    losses: 2,
    equippedGear: {
      weapon: AVAILABLE_GEAR[0], // Gladius (+8 Dmg, +4 Shield)
      armor: AVAILABLE_GEAR[3],  // Scutum Guard (+16 Shield, +10 HP)
      crest: AVAILABLE_GEAR[7],  // Mars Crest (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_varia',
    name: 'Varia the Viper',
    title: 'The Unbroken Blade',
    archetypeId: 'thraex',
    maxHp: 110,
    currentHp: 110,
    shieldCharges: 4,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Aggressive armor-piercer with hooked sica & war crest.',
    wins: 18,
    losses: 5,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Hooked Sica (+15 Dmg)
      crest: AVAILABLE_GEAR[7],  // Warhorn Crest of Mars (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_batiatus',
    name: 'Batiatus Net-Master',
    title: 'The Pit Disruptor',
    archetypeId: 'retiarius',
    maxHp: 115,
    currentHp: 115,
    shieldCharges: 8,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Disruptive crowd-pleaser using weighted trident, galerus & mars crest.',
    wins: 11,
    losses: 4,
    equippedGear: {
      weapon: AVAILABLE_GEAR[2], // Weighted Trident (+6 Dmg, +8 Shield, +10 HP)
      armor: AVAILABLE_GEAR[5],  // Galerus (+8 Dmg, +10 Shield)
      crest: AVAILABLE_GEAR[7],  // Mars Crest (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_flamma',
    name: 'Flamma the Immortal',
    title: 'Arena Grandmaster',
    archetypeId: 'thraex',
    maxHp: 135,
    currentHp: 135,
    shieldCharges: 10,
    houseName: 'House of the Golden Falcon',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Veteran arena champion with sica & lorica hamata.',
    wins: 34,
    losses: 1,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[4],  // Lorica Hamata (+6 Shield, +25 HP)
    },
  },

  // --- TIER 2 / BLOOD SANDS SYNDICATE ---
  {
    id: 'enemy_crixus',
    name: 'Crixus the Undefeated',
    title: 'Gaulic Heavy Wall',
    archetypeId: 'murmillo',
    maxHp: 135,
    currentHp: 135,
    shieldCharges: 18,
    houseName: 'Blood Sands Syndicate',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Fierce Gaulic warlord with gladius, lorica hamata & mars crest.',
    wins: 22,
    losses: 3,
    equippedGear: {
      weapon: AVAILABLE_GEAR[0], // Gladius (+8 Dmg, +4 Shield)
      armor: AVAILABLE_GEAR[4],  // Lorica Hamata (+6 Shield, +25 HP)
      crest: AVAILABLE_GEAR[7],  // Mars Crest (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_spartacus',
    name: 'Spartacus the Breaker',
    title: 'Liberator of Capua',
    archetypeId: 'thraex',
    maxHp: 130,
    currentHp: 130,
    shieldCharges: 10,
    houseName: 'Blood Sands Syndicate',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Master dual-blade boss champion with full sica, galerus & mars crest (+33 Dmg).',
    wins: 40,
    losses: 0,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Hooked Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[5],  // Galerus (+8 Dmg, +10 Shield)
      crest: AVAILABLE_GEAR[7],  // Crest of Mars (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_gannicus',
    name: 'Gannicus the Shadow',
    title: 'Flamboyant Champion',
    archetypeId: 'retiarius',
    maxHp: 115,
    currentHp: 115,
    shieldCharges: 12,
    houseName: 'Blood Sands Syndicate',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'High risk evasion net master with weighted trident, galerus & mars crest.',
    wins: 28,
    losses: 6,
    equippedGear: {
      weapon: AVAILABLE_GEAR[2], // Trident (+6 Dmg, +8 Shield, +10 HP)
      armor: AVAILABLE_GEAR[5],  // Galerus (+8 Dmg, +10 Shield)
      crest: AVAILABLE_GEAR[7],  // Mars Crest (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_oenomaus',
    name: 'Oenomaus the Doctore',
    title: 'Trainer of Gladiators',
    archetypeId: 'murmillo',
    maxHp: 150,
    currentHp: 150,
    shieldCharges: 22,
    houseName: 'Blood Sands Syndicate',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Impenetrable defense boss with scutum guard, aegis banner & gladius.',
    wins: 30,
    losses: 4,
    equippedGear: {
      weapon: AVAILABLE_GEAR[0], // Gladius (+8 Dmg, +4 Shield)
      armor: AVAILABLE_GEAR[3],  // Scutum Guard (+16 Shield, +10 HP)
      crest: AVAILABLE_GEAR[6],  // Golden Laurel (+6 Dmg, +8 Shield, +12 HP)
    },
  },

  // --- TIER 3 / CRIMSON COLOSSEUM ---
  {
    id: 'enemy_priscus',
    name: 'Priscus Net-Binder',
    title: 'Trident Specialist',
    archetypeId: 'retiarius',
    maxHp: 115,
    currentHp: 115,
    shieldCharges: 10,
    houseName: 'Crimson Colosseum',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Specializes in entangling nets with trident & aegis banner.',
    wins: 15,
    losses: 7,
    equippedGear: {
      weapon: AVAILABLE_GEAR[2], // Trident (+6 Dmg, +8 Shield, +10 HP)
      crest: AVAILABLE_GEAR[8],  // Aegis Banner (+12 Shield, +15 HP)
    },
  },
  {
    id: 'enemy_verus',
    name: 'Verus the Crimson',
    title: 'Colosseum Favorite',
    archetypeId: 'thraex',
    maxHp: 115,
    currentHp: 115,
    shieldCharges: 6,
    houseName: 'Crimson Colosseum',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Crowd-favorite striker with hooked sica & galerus.',
    wins: 19,
    losses: 8,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Hooked Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[5],  // Galerus (+8 Dmg, +10 Shield)
    },
  },
  {
    id: 'enemy_commodus',
    name: 'Emperor Commodus',
    title: 'Self-Proclaimed Hercules',
    archetypeId: 'murmillo',
    maxHp: 152,
    currentHp: 152,
    shieldCharges: 25,
    houseName: 'Crimson Colosseum',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Supreme Imperial boss with gilded sica, scutum guard & golden laurel.',
    wins: 50,
    losses: 0,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[3],  // Imperial Scutum Guard (+16 Shield, +10 HP)
      crest: AVAILABLE_GEAR[6],  // Golden Laurel (+6 Dmg, +8 Shield, +12 HP)
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
    buildDescription: 'Raw un-armored offense honed hunting arena lions.',
    wins: 25,
    losses: 3,
    // Un-geared
  },

  // --- TIER 4 / IMPERIAL VANGUARD ---
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
    buildDescription: 'Fast rookie skirmisher with basic net traps.',
    wins: 12,
    losses: 9,
    // Un-geared
  },
  {
    id: 'enemy_spiculus',
    name: 'Spiculus the Favored',
    title: 'Nero’s Paladin',
    archetypeId: 'murmillo',
    maxHp: 135,
    currentHp: 135,
    shieldCharges: 18,
    houseName: 'Imperial Vanguard',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Disciplined shield paladin with gladius, scutum guard & aegis banner.',
    wins: 21,
    losses: 5,
    equippedGear: {
      weapon: AVAILABLE_GEAR[0], // Gladius (+8 Dmg, +4 Shield)
      armor: AVAILABLE_GEAR[3],  // Scutum Guard (+16 Shield, +10 HP)
      crest: AVAILABLE_GEAR[8],  // Aegis Banner (+12 Shield, +15 HP)
    },
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
    buildDescription: 'Unpredictable un-armored rookie duel hero.',
    wins: 9,
    losses: 1,
    // Un-geared
  },
  {
    id: 'enemy_titurius',
    name: 'Centurion Titurius',
    title: 'Legion Commandant',
    archetypeId: 'murmillo',
    maxHp: 155,
    currentHp: 155,
    shieldCharges: 20,
    houseName: 'Imperial Vanguard',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Iron-clad commandant boss with sica, lorica hamata & golden laurel.',
    wins: 27,
    losses: 4,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[4],  // Lorica Hamata (+6 Shield, +25 HP)
      crest: AVAILABLE_GEAR[6],  // Golden Laurel (+6 Dmg, +8 Shield, +12 HP)
    },
  },

  // --- TIER 5 / IRON SERPENT LUDUS ---
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
    buildDescription: 'Un-armored trapper using venomous net tactics.',
    wins: 16,
    losses: 7,
    // Un-geared
  },
  {
    id: 'enemy_servilius',
    name: 'Servilius Iron-Fang',
    title: 'Serpent Executioner',
    archetypeId: 'thraex',
    maxHp: 110,
    currentHp: 110,
    shieldCharges: 6,
    houseName: 'Iron Serpent Ludus',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'High critical striker with hooked sica & mars crest.',
    wins: 18,
    losses: 6,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Hooked Sica (+15 Dmg)
      crest: AVAILABLE_GEAR[7],  // Mars Crest (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_domitius',
    name: 'Domitius Apex',
    title: 'Pinnacle Shield',
    archetypeId: 'murmillo',
    maxHp: 136,
    currentHp: 136,
    shieldCharges: 18,
    houseName: 'Iron Serpent Ludus',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Heavy defensive wall with gladius, scutum guard & golden laurel.',
    wins: 20,
    losses: 5,
    equippedGear: {
      weapon: AVAILABLE_GEAR[0], // Gladius (+8 Dmg, +4 Shield)
      armor: AVAILABLE_GEAR[3],  // Scutum Guard (+16 Shield, +10 HP)
      crest: AVAILABLE_GEAR[6],  // Golden Laurel (+6 Dmg, +8 Shield, +12 HP)
    },
  },
  {
    id: 'enemy_lucius',
    name: 'Lucius Scythe',
    title: 'Reaper of Capua',
    archetypeId: 'thraex',
    maxHp: 125,
    currentHp: 125,
    shieldCharges: 10,
    houseName: 'Iron Serpent Ludus',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Fully-geared armor-piercing reaper boss with sica, galerus & mars crest.',
    wins: 23,
    losses: 4,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Hooked Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[5],  // Galerus (+8 Dmg, +10 Shield)
      crest: AVAILABLE_GEAR[7],  // Crest of Mars (+10 Dmg, +5 HP)
    },
  },

  // --- TIER 6 / LEGIO INVICTA RIVALS ---
  {
    id: 'enemy_cassius',
    name: 'Cassius Trident-Grip',
    title: 'Sea Demon',
    archetypeId: 'retiarius',
    maxHp: 125,
    currentHp: 125,
    shieldCharges: 12,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Trident master equipped with weighted trident, galerus & aegis banner.',
    wins: 17,
    losses: 5,
    equippedGear: {
      weapon: AVAILABLE_GEAR[2], // Trident (+6 Dmg, +8 Shield, +10 HP)
      armor: AVAILABLE_GEAR[5],  // Galerus (+8 Dmg, +10 Shield)
      crest: AVAILABLE_GEAR[8],  // Aegis Banner (+12 Shield, +15 HP)
    },
  },
  {
    id: 'enemy_tiberius',
    name: 'Tiberius Titan',
    title: 'The Unshakable',
    archetypeId: 'murmillo',
    maxHp: 150,
    currentHp: 150,
    shieldCharges: 22,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Fully-geared Titan boss equipped with gladius, scutum & mars crest.',
    wins: 31,
    losses: 2,
    equippedGear: {
      weapon: AVAILABLE_GEAR[0], // Gladius (+8 Dmg, +4 Shield)
      armor: AVAILABLE_GEAR[3],  // Scutum Guard (+16 Shield, +10 HP)
      crest: AVAILABLE_GEAR[7],  // Mars Crest (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_valerius',
    name: 'Valerius Blood-Shed',
    title: 'Carnage Champion',
    archetypeId: 'thraex',
    maxHp: 110,
    currentHp: 110,
    shieldCharges: 4,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Fast-paced striker with hooked sica & mars crest.',
    wins: 24,
    losses: 7,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Hooked Sica (+15 Dmg)
      crest: AVAILABLE_GEAR[7],  // Crest of Mars (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_septimius',
    name: 'Septimius Tempest',
    title: 'Storm Caster',
    archetypeId: 'retiarius',
    maxHp: 125,
    currentHp: 125,
    shieldCharges: 10,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/retiarius.png',
    buildDescription: 'Fully-geared net tempest boss with sica, galerus & mars crest.',
    wins: 14,
    losses: 6,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[5],  // Galerus (+8 Dmg, +10 Shield)
      crest: AVAILABLE_GEAR[7],  // Mars Crest (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_antoninus',
    name: 'Antoninus Executioner',
    title: 'The Pit Cleaver',
    archetypeId: 'thraex',
    maxHp: 125,
    currentHp: 125,
    shieldCharges: 8,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Fully-geared executioner boss with hooked sica, galerus & mars crest.',
    wins: 26,
    losses: 4,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Hooked Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[5],  // Galerus (+8 Dmg, +10 Shield)
      crest: AVAILABLE_GEAR[7],  // Crest of Mars (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_claudius',
    name: 'Claudius Bastion',
    title: 'Fortress Guardian',
    archetypeId: 'murmillo',
    maxHp: 145,
    currentHp: 145,
    shieldCharges: 18,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'High shield defender with gladius, lorica hamata & aegis banner.',
    wins: 22,
    losses: 5,
    equippedGear: {
      weapon: AVAILABLE_GEAR[0], // Gladius (+8 Dmg, +4 Shield)
      armor: AVAILABLE_GEAR[4],  // Lorica Hamata (+6 Shield, +25 HP)
      crest: AVAILABLE_GEAR[8],  // Aegis Banner (+12 Shield, +15 HP)
    },
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
    buildDescription: 'Un-armored net caster disrupting rival stabs.',
    wins: 13,
    losses: 8,
    // Un-geared
  },
  {
    id: 'enemy_drusus',
    name: 'Drusus Gladius',
    title: 'Iron Sword Master',
    archetypeId: 'thraex',
    maxHp: 130,
    currentHp: 130,
    shieldCharges: 8,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Disciplined sword master with gladius, lorica hamata & mars crest.',
    wins: 19,
    losses: 6,
    equippedGear: {
      weapon: AVAILABLE_GEAR[0], // Gladius (+8 Dmg, +4 Shield)
      armor: AVAILABLE_GEAR[4],  // Lorica Hamata (+6 Shield, +25 HP)
      crest: AVAILABLE_GEAR[7],  // Mars Crest (+10 Dmg, +5 HP)
    },
  },
  {
    id: 'enemy_felix',
    name: 'Felix Fortunatus',
    title: 'The Lucky Blade',
    archetypeId: 'murmillo',
    maxHp: 145,
    currentHp: 145,
    shieldCharges: 20,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/murmillo.png',
    buildDescription: 'Fully-geared champion boss with sica, scutum guard & golden laurel.',
    wins: 16,
    losses: 6,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[3],  // Scutum Guard (+16 Shield, +10 HP)
      crest: AVAILABLE_GEAR[6],  // Golden Laurel (+6 Dmg, +8 Shield, +12 HP)
    },
  },
  {
    id: 'enemy_maximus',
    name: 'Maximus Decimus Meridius',
    title: 'Commander of the Northern Armies',
    archetypeId: 'thraex',
    maxHp: 145,
    currentHp: 145,
    shieldCharges: 14,
    houseName: 'Legio Invicta Rivals',
    isPlayer: false,
    avatarUrl: './assets/thraex.png',
    buildDescription: 'Fully-geared Grand Arena Legend boss with sica, galerus & mars crest.',
    wins: 60,
    losses: 0,
    equippedGear: {
      weapon: AVAILABLE_GEAR[1], // Hooked Sica (+15 Dmg)
      armor: AVAILABLE_GEAR[5],  // Galerus (+8 Dmg, +10 Shield)
      crest: AVAILABLE_GEAR[7],  // Crest of Mars (+10 Dmg, +5 HP)
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
  chosenWildSymbol?: SymbolType,
  streakCount: number = 0
): {
  outcome: TurnOutcome;
  updatedFirstNetUsed: boolean;
  updatedAttackerShields: number;
  updatedDefenderShields: number;
} {
  const combination = evaluateCombination(reels, chosenWildSymbol);
  const attackerArchetype = ARCHETYPES[attacker.archetypeId];

  const gearStats = getGearStats(attacker.equippedGear);
  const gearDamageBonus = gearStats.damageBonus;
  const gearShieldBonus = gearStats.shieldBonus;

  const hasTriangleAdvantage = attackerArchetype.favoredAgainst === defender.archetypeId;
  const triangleMultiplier = hasTriangleAdvantage ? 1.15 : 1.0;

  const streakBonusPct = streakCount > 1 ? Math.min(0.25, (streakCount - 1) * 0.05) : 0;
  const streakMultiplier = 1 + streakBonusPct;

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

  if (streakBonusPct > 0 && rawDamage > 0) {
    rawDamage = Math.round(rawDamage * streakMultiplier);
    abilityTriggered = (abilityTriggered ? abilityTriggered + ' | ' : '') + `🔥 Streak x${streakCount} (+${Math.round(streakBonusPct * 100)}% Dmg)`;
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
    let playerFirstNetResisted = false;
    let enemyFirstNetResisted = false;

    while (turn <= 8 && simPlayer.currentHp > 0 && simEnemy.currentHp > 0) {
      // 1. Player Turn
      const playerTurn = resolveTurn(
        turn,
        simPlayer,
        simEnemy,
        spinReels(),
        activeEntangledPlayer,
        playerFirstNetResisted
      );

      playerFirstNetResisted = playerTurn.updatedFirstNetUsed;
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
        enemyFirstNetResisted
      );

      enemyFirstNetResisted = enemyTurn.updatedFirstNetUsed;
      simPlayer.currentHp = Math.max(0, simPlayer.currentHp - enemyTurn.outcome.netDamage);
      simPlayer.shieldCharges = enemyTurn.updatedDefenderShields;
      simEnemy.shieldCharges = enemyTurn.updatedAttackerShields;

      if (enemyTurn.outcome.debuffApplied) activeEntangledPlayer = true;
      else activeEntangledPlayer = false;
      activeEntangledEnemy = false;

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
