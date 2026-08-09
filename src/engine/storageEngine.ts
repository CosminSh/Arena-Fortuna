export interface PlayerProfile {
  playerName: string;
  warPoints: number;
  victories: number;
  defeats: number;
  exp: number;
  level: number;
  highestStreak: number;
  currentStreak: number;
  hasCompletedTutorial?: boolean;
}

const STORAGE_KEY = 'arena_reels_player_profile_v1';

const DEFAULT_PROFILE: PlayerProfile = {
  playerName: 'Imperator',
  warPoints: 0,
  victories: 0,
  defeats: 0,
  exp: 0,
  level: 1,
  highestStreak: 0,
  currentStreak: 0,
  hasCompletedTutorial: false,
};

export function loadPlayerProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      playerName: parsed.playerName && parsed.playerName.trim() !== '' ? parsed.playerName.trim() : 'Imperator',
      level: Math.floor((parsed.exp || 0) / 300) + 1,
      hasCompletedTutorial: parsed.hasCompletedTutorial ?? false,
    };
  } catch (e) {
    console.error('Failed to load profile from localStorage', e);
    return { ...DEFAULT_PROFILE };
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function setTutorialCompleted(completed: boolean = true): PlayerProfile {
  const current = loadPlayerProfile();
  const updated: PlayerProfile = {
    ...current,
    hasCompletedTutorial: completed,
  };
  savePlayerProfile(updated);
  return updated;
}

export function updatePlayerName(name: string): PlayerProfile {
  const current = loadPlayerProfile();
  const trimmed = name.trim() || 'Imperator';
  const updated: PlayerProfile = {
    ...current,
    playerName: trimmed,
  };
  savePlayerProfile(updated);
  return updated;
}

export function recordBattleOutcome(isVictory: boolean, streakAchieved: number = 0): {
  updatedProfile: PlayerProfile;
  earnedExp: number;
  earnedPoints: number;
  leveledUp: boolean;
} {
  const current = loadPlayerProfile();
  const earnedExp = isVictory ? 120 : 40;
  const earnedPoints = isVictory ? 150 : 50;

  const oldLevel = current.level;
  const newExp = current.exp + earnedExp;
  const newLevel = Math.floor(newExp / 300) + 1;
  const leveledUp = newLevel > oldLevel;

  const newVictories = current.victories + (isVictory ? 1 : 0);
  const newDefeats = current.defeats + (isVictory ? 0 : 1);
  const newCurrentStreak = isVictory ? current.currentStreak + 1 : 0;
  const newHighestStreak = Math.max(current.highestStreak, streakAchieved, newCurrentStreak);

  const updatedProfile: PlayerProfile = {
    ...current,
    warPoints: current.warPoints + earnedPoints,
    victories: newVictories,
    defeats: newDefeats,
    exp: newExp,
    level: newLevel,
    highestStreak: newHighestStreak,
    currentStreak: newCurrentStreak,
  };

  savePlayerProfile(updatedProfile);

  return {
    updatedProfile,
    earnedExp,
    earnedPoints,
    leveledUp,
  };
}

