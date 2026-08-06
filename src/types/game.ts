export type ArchetypeId = 'murmillo' | 'thraex' | 'retiarius';

export type SymbolType = 'sword' | 'shield' | 'class' | 'wild';

export interface Archetype {
  id: ArchetypeId;
  name: string;
  subName: string;
  weapon: string;
  shield: string;
  abilityName: string;
  abilityDesc: string;
  identity: string;
  icon: string;
  portrait: string;
  favoredAgainst: ArchetypeId;
  weakAgainst: ArchetypeId;
}

export interface Gladiator {
  id: string;
  name: string;
  title: string;
  archetypeId: ArchetypeId;
  maxHp: number;
  currentHp: number;
  shieldCharges: number;
  houseName: string;
  isPlayer: boolean;
  avatarUrl: string;
  buildDescription?: string;
  wins?: number;
  losses?: number;
}

export interface House {
  name: string;
  motto: string;
  color: string;
  bannerIcon: string;
  rank: number;
  warPoints: number;
  victories: number;
  defeats: number;
}

export interface ReelSymbol {
  id: string;
  type: SymbolType;
  label: string;
  icon: string;
  color: string;
}

export interface CombinationResult {
  matchCount: number; // 3, 2, or 0
  primarySymbol: SymbolType;
  hasWild: boolean;
  rawSymbols: SymbolType[];
  description: string;
  tier: 'jackpot' | 'common' | 'fumble';
}

export interface TurnOutcome {
  turnNumber: number;
  attackerId: string;
  attackerName: string;
  defenderId: string;
  defenderName: string;
  reels: SymbolType[];
  combination: CombinationResult;
  rawDamage: number;
  shieldBlocked: number;
  piercedDamage: number;
  netDamage: number;
  abilityTriggered: string | null;
  debuffApplied: string | null;
  rerollGranted: boolean;
  attackerHpAfter: number;
  defenderHpAfter: number;
  logMessage: string;
}

export interface BattleState {
  playerGladiator: Gladiator;
  enemyGladiator: Gladiator;
  currentTurn: number; // 1 to 8
  isPlayerTurn: boolean;
  isSpinning: boolean;
  lockedReelIndexes: boolean[]; // reel indices locked if applicable
  history: TurnOutcome[];
  winnerId: string | null;
  isOver: boolean;
  canReroll: boolean;
  hasUsedRerollThisTurn: boolean;
  matchupBonus: {
    attackerAdvantage: boolean;
    defenderAdvantage: boolean;
    percentage: number;
  };
}

export interface SymbolProbability {
  symbol: SymbolType;
  label: string;
  weight: number; // e.g., 35 for 35%
  singleOdds: string; // "35%"
  tripleOdds: string; // "4.29%"
}
