import { ref, set, onValue, update, get, remove, runTransaction } from 'firebase/database';
import { database } from '@/lib/firebase';
import { MultiplayerGameState } from '@/types/multiplayer';
import { Roster } from '@/types';

/**
 * Generates a short room code that is easy to share verbally or over chat.
 * The collision risk is acceptable because the app also checks room existence
 * before letting a guest join.
 */
export const generateGameId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Generates a browser-scoped player identifier used to distinguish hosts and
 * guests without requiring account sign-in.
 */
export const generatePlayerId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Creates a monotonic-ish action token for conflict detection and replay
 * suppression across realtime listeners.
 */
export const generateActionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Normalizes roster payloads from Firebase into a fixed six-slot array.
 * Firebase can round-trip arrays as sparse objects, so the UI always receives
 * a predictable shape regardless of how the value was persisted.
 */
const normalizeRoster = (roster: any): Roster => {
  if (!roster || typeof roster !== 'object') {
    return Array(6).fill(null);
  }
  
  // If it's an array-like object from Firebase
  if (!Array.isArray(roster)) {
    const arr = Array(6).fill(null);
    Object.keys(roster).forEach(key => {
      const index = parseInt(key);
      if (!isNaN(index) && index >= 0 && index < 6) {
        arr[index] = roster[key] || null;
      }
    });
    return arr;
  }
  
  // Ensure it's exactly 6 elements and null instead of undefined
  const normalized = Array(6).fill(null);
  for (let i = 0; i < 6; i++) {
    normalized[i] = roster[i] || null;
  }
  return normalized;
};

/**
 * Creates a new multiplayer room in Realtime Database.
 * The initial record stores both the game settings and the first action ID so
 * clients can detect the first authoritative update without a separate schema.
 */
export const createMultiplayerGame = async (
  hostId: string,
  gameSettings: {
    activeEras: string[];
    noDuplicatesMode: boolean;
    skipEnabled: boolean;
    moveEnabled: boolean;
  },
  hostName?: string
): Promise<string> => {
  const gameId = generateGameId();
  const gameRef = ref(database, `games/${gameId}`);
  const now = Date.now();
  
  const initialState: MultiplayerGameState = {
    gameId,
    hostId,
    guestId: null,
    hostName,
    firstPlayer: 1, // Host always goes first in the first game
    gameStarted: false,
    pickIndex: 0,
    p1Roster: Array(6).fill(null),
    p2Roster: Array(6).fill(null),
    gameFinished: false,
    activeEras: gameSettings.activeEras,
    noDuplicatesMode: gameSettings.noDuplicatesMode,
    usedTeams: [],
    p1SkipUsed: false,
    p2SkipUsed: false,
    p1MoveUsed: false,
    p2MoveUsed: false,
    skipEnabled: gameSettings.skipEnabled,
    moveEnabled: gameSettings.moveEnabled,
    spinResult: null,
    selectedPosition: null,
    createdAt: now,
    lastUpdated: now,
    lastActionId: generateActionId()
  };
  
  try {
    await set(gameRef, initialState);
  } catch (error) {
    console.error('Error creating game in Firebase:', error);
    throw error;
  }
  
  return gameId;
};

/**
 * Joins an existing room if it exists and still has an open guest slot.
 * Returns `false` instead of throwing for common user-facing failures so the
 * UI can show a friendly error message.
 */
export const joinMultiplayerGame = async (
  gameId: string,
  guestId: string,
  guestName?: string
): Promise<boolean> => {
  const gameRef = ref(database, `games/${gameId}`);
  
  try {
    // First check if game exists
    const snapshot = await get(gameRef);
    if (!snapshot.exists()) {
      console.error('Game does not exist:', gameId);
      return false;
    }
    
    const gameData = snapshot.val();
    
    if (gameData.guestId) {
      console.error('Game is already full:', gameId);
      return false;
    }
    
    // Use simple update instead of transaction for better reliability
    await update(gameRef, {
      guestId,
      guestName,
      gameStarted: true,
      lastUpdated: Date.now(),
      lastActionId: generateActionId()
    });
    
    return true;
  } catch (error) {
    console.error('Error joining game:', error);
    return false;
  }
};

/**
 * Subscribes to room updates and converts Firebase quirks into the local game
 * state shape expected by the React tree.
 */
export const subscribeToGame = (
  gameId: string,
  callback: (gameState: MultiplayerGameState | null) => void
) => {
  const gameRef = ref(database, `games/${gameId}`);
  
  const unsubscribe = onValue(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      const rawData = snapshot.val();
      // Normalize rosters to handle Firebase null/undefined conversion
      const normalizedData: MultiplayerGameState = {
        ...rawData,
        p1Roster: normalizeRoster(rawData.p1Roster),
        p2Roster: normalizeRoster(rawData.p2Roster),
        usedTeams: Array.isArray(rawData.usedTeams) ? rawData.usedTeams : []
      };
      callback(normalizedData);
    } else {
      callback(null);
    }
  });
  
  return unsubscribe;
};

/**
 * Marks the active participant as disconnected so the remaining client can be
 * routed back to the lobby instead of drafting into a dead session.
 */
export const markPlayerDisconnected = async (
  gameId: string,
  playerRole: 'host' | 'guest'
): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  await update(gameRef, {
    [`${playerRole}Disconnected`]: true
  });
};

/**
 * Writes game state through a transaction to prevent competing draft actions
 * from overwriting each other when both clients react to the same spin.
 */
export const updateGameState = async (
  gameId: string,
  updates: Partial<MultiplayerGameState>,
  expectedActionId?: string
): Promise<boolean> => {
  const gameRef = ref(database, `games/${gameId}`);
  
  try {
    const result = await runTransaction(gameRef, (currentData) => {
      if (!currentData) {
        return; // Abort - game doesn't exist
      }
      
      // If expectedActionId is provided, check for conflicts
      if (expectedActionId && currentData.lastActionId !== expectedActionId) {
        console.warn('Action conflict detected, aborting update');
        return; // Abort - someone else updated first
      }
      
      // Apply updates with new timestamp and action ID
      return {
        ...currentData,
        ...updates,
        lastUpdated: Date.now(),
        lastActionId: generateActionId()
      };
    });
    
    return result.committed;
  } catch (error) {
    console.error('Error updating game state:', error);
    return false;
  }
};

/** Deletes a room after the game ends or the session is explicitly closed. */
export const deleteGame = async (gameId: string): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  await remove(gameRef);
};

/**
 * Removes abandoned rooms older than 24 hours so the database does not retain
 * stale game state forever.
 */
export const cleanupOldGames = async (): Promise<void> => {
  const gamesRef = ref(database, 'games');
  const snapshot = await get(gamesRef);
  
  if (snapshot.exists()) {
    const games = snapshot.val();
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    for (const gameId in games) {
      const game = games[gameId] as MultiplayerGameState;
      if (now - game.createdAt > dayInMs) {
        await deleteGame(gameId);
      }
    }
  }
};
