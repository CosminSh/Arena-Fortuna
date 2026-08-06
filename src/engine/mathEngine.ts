import { Archetype, ArchetypeId, Gladiator, SymbolType, CombinationResult, TurnOutcome } from '../types/game';

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

export const SYMBOL_WEIGHTS: Record<SymbolType, number> = {
  sword: 35,
  shield: 30,
  class: 25,
  wild: 10,
};

// Generate a random reel spin result
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

// Evaluates 3 symbols including Wild substitution
export function evaluateCombination(reels: SymbolType[]): CombinationResult {
  const nonWilds = reels.filter((s) => s !== 'wild');
  const wildCount = reels.length - nonWilds.length;

  if (wildCount === 3) {
    return {
      matchCount: 3,
      primarySymbol: 'sword', // Triple Wild defaults to sword jackpot
      hasWild: true,
      rawSymbols: reels,
      description: 'TRIPLE WILD JACKPOT! Unleashes maximum combat potential.',
      tier: 'jackpot',
    };
  }

  // Count frequency of non-wild symbols
  const counts: Record<string, number> = {};
  for (const s of nonWilds) {
    counts[s] = (counts[s] || 0) + 1;
  }

  // Find symbol with highest frequency
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
      description: `3-OF-A-KIND ${bestSymbol.toUpperCase()}! Full power outcome.`,
      tier: 'jackpot',
    };
  } else if (effectiveMatch === 2) {
    return {
      matchCount: 2,
      primarySymbol: bestSymbol,
      hasWild: wildCount > 0,
      rawSymbols: reels,
      description: `2-OF-A-KIND ${bestSymbol.toUpperCase()}. Standard effective outcome.`,
      tier: 'common',
    };
  } else {
    return {
      matchCount: 1,
      primarySymbol: nonWilds[0] || 'sword',
      hasWild: false,
      rawSymbols: reels,
      description: 'NO MATCH! Weak roll, minimal effect.',
      tier: 'fumble',
    };
  }
}

// Calculate battle turn combat resolution
export function resolveTurn(
  turnNumber: number,
  attacker: Gladiator,
  defender: Gladiator,
  reels: SymbolType[],
  activeEntangled: boolean, // If defender applied entangled on attacker
  firstNetUsed: boolean // For Murmillo Scutum Wall
): { outcome: TurnOutcome; updatedFirstNetUsed: boolean } {
  const combination = evaluateCombination(reels);
  const attackerArchetype = ARCHETYPES[attacker.archetypeId];
  const defenderArchetype = ARCHETYPES[defender.archetypeId];

  // Soft triangle check
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

  // Base outcome calculations based on combination
  if (primarySymbol === 'sword') {
    if (matchCount === 3) rawDamage = Math.round(40 * triangleMultiplier);
    else if (matchCount === 2) rawDamage = Math.round(25 * triangleMultiplier);
    else rawDamage = Math.round(10 * triangleMultiplier);
  } else if (primarySymbol === 'shield') {
    if (matchCount === 3) shieldGranted = 35;
    else if (matchCount === 2) shieldGranted = 20;
    else shieldGranted = 8;

    // Murmillo Ability: Scutum Wall (+25% shield block)
    if (attacker.archetypeId === 'murmillo') {
      shieldGranted = Math.round(shieldGranted * 1.25);
      abilityTriggered = 'Scutum Wall (+25% Shield Protection)';
    }
  } else if (primarySymbol === 'class') {
    abilityTriggered = `${attackerArchetype.name}: ${attackerArchetype.abilityName}`;

    if (attacker.archetypeId === 'murmillo') {
      // Murmillo Class ability: Defense & Fortify
      if (matchCount === 3) {
        shieldGranted = 45;
        rawDamage = 15;
      } else if (matchCount === 2) {
        shieldGranted = 25;
        rawDamage = 10;
      } else {
        shieldGranted = 10;
      }
    } else if (attacker.archetypeId === 'thraex') {
      // Thraex Class ability: Hooked Blade (High damage + ignore shield)
      if (matchCount === 3) {
        rawDamage = Math.round(45 * triangleMultiplier);
        piercedDamage = Math.round(rawDamage * 0.4); // 40% shield bypass
      } else if (matchCount === 2) {
        rawDamage = Math.round(28 * triangleMultiplier);
        piercedDamage = Math.round(rawDamage * 0.25); // 25% shield bypass
      } else {
        rawDamage = 12;
      }
    } else if (attacker.archetypeId === 'retiarius') {
      // Retiarius Class ability: Entangling Net
      if (matchCount === 3) {
        rawDamage = Math.round(35 * triangleMultiplier);
        debuffApplied = 'Entangled (-30% enemy next dmg)';
        rerollGranted = true;
      } else if (matchCount === 2) {
        rawDamage = Math.round(22 * triangleMultiplier);
        debuffApplied = 'Entangled (-30% enemy next dmg)';
      } else {
        rawDamage = 10;
      }
    }
  }

  // Thraex passive: 25% of Sword damage ignores shields; 2 sword symbols strip 1 enemy shield charge
  if (attacker.archetypeId === 'thraex' && primarySymbol === 'sword') {
    piercedDamage = Math.round(rawDamage * 0.25);
    if (matchCount >= 2 && defender.shieldCharges > 0) {
      abilityTriggered = (abilityTriggered ? abilityTriggered + ' | ' : '') + 'Hooked Blade (Stripped 1 Enemy Shield)';
    }
  }

  // Apply Entangled debuff penalty if attacker is entangled
  if (activeEntangled) {
    let reduction = 0.3; // 30% reduction
    // Murmillo passive: First Net effect received is reduced by half (15% reduction instead of 30%)
    if (attacker.archetypeId === 'murmillo' && !firstNetUsed) {
      reduction = 0.15;
      newFirstNetUsed = true;
      abilityTriggered = (abilityTriggered ? abilityTriggered + ' | ' : '') + 'Scutum Wall (Resisted 50% Net Disruption)';
    }
    rawDamage = Math.round(rawDamage * (1 - reduction));
  }

  // Calculate damage against defender's shield charges
  let shieldBlocked = 0;
  let remainingDamage = rawDamage;

  if (defender.shieldCharges > 0 && remainingDamage > 0) {
    const shieldAbsorb = Math.min(defender.shieldCharges, remainingDamage - piercedDamage);
    shieldBlocked = Math.max(0, Math.round(shieldAbsorb));
    remainingDamage = Math.max(0, remainingDamage - shieldBlocked);
  }

  netDamage = Math.max(0, Math.round(remainingDamage));

  // Thraex strip shield check
  let updatedDefenderShields = Math.max(0, defender.shieldCharges - shieldBlocked + shieldGranted * 0); 
  // (Shield granted goes to attacker, defender shields absorb damage)
  if (attacker.archetypeId === 'thraex' && primarySymbol === 'sword' && matchCount >= 2) {
    updatedDefenderShields = Math.max(0, updatedDefenderShields - 15);
  }

  const updatedDefenderHp = Math.max(0, defender.currentHp - netDamage);
  const updatedAttackerShields = attacker.shieldCharges + shieldGranted;

  // Build combat log message
  let logMessage = `${attacker.name} rolled [${reels.map(r => r.toUpperCase()).join(' | ')}]. ${combination.description}`;
  if (netDamage > 0) {
    logMessage += ` Dealt ${netDamage} HP damage`;
    if (shieldBlocked > 0) logMessage += ` (${shieldBlocked} blocked by shield)`;
    if (piercedDamage > 0) logMessage += ` [${piercedDamage} shield-piercing]`;
    logMessage += `.`;
  } else if (shieldGranted > 0) {
    logMessage += ` Raised +${shieldGranted} shield protection.`;
  }
  if (debuffApplied) logMessage += ` Applied ${debuffApplied}!`;
  if (rerollGranted) logMessage += ` Granted a FREE REROLL!`;

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
