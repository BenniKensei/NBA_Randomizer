// Local storage utilities

const GAME_STATE_KEY = 'nba-draft-game';

interface SavedGameState {
  gameStarted: boolean;
  pickIndex: number;
  p1Roster: any[];
  p2Roster: any[];
  gameFinished: boolean;
}

/**
 * Save game state to localStorage
 */
export const saveGameState = (state: SavedGameState): void => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

/**
 * Load game state from localStorage
 */
export const loadGameState = (): SavedGameState | null => {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

/**
 * Clear saved game state
 */
export const clearGameState = (): void => {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};
