import { ref, set, onValue, update, get, remove, runTransaction } from 'firebase/database';
import { database } from '@/lib/firebase';
import { MultiplayerGameState } from '@/types/multiplayer';
import { Roster } from '@/types';

// Generate a unique game ID
export const generateGameId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Generate a unique player ID
export const generatePlayerId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate a unique action ID for deduplication
export const generateActionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Normalize roster arrays to handle Firebase null/undefined issues
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

// Create a new multiplayer game
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
  
  console.log('Creating game with ID:', gameId);
  
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
  
  console.log('Writing game to Firebase:', initialState);
  try {
    await set(gameRef, initialState);
    console.log('Game created successfully:', gameId);
  } catch (error) {
    console.error('Error creating game in Firebase:', error);
    throw error;
  }
  
  return gameId;
};

// Join an existing multiplayer game
export const joinMultiplayerGame = async (
  gameId: string,
  guestId: string,
  guestName?: string
): Promise<boolean> => {
  const gameRef = ref(database, `games/${gameId}`);
  
  try {
    console.log('Attempting to join game:', gameId, 'as guest:', guestId);
    
    // First check if game exists
    const snapshot = await get(gameRef);
    if (!snapshot.exists()) {
      console.error('Game does not exist:', gameId);
      return false;
    }
    
    const gameData = snapshot.val();
    console.log('Found game data:', gameData);
    
    if (gameData.guestId) {
      console.error('Game is already full:', gameId);
      return false;
    }
    
    // Use simple update instead of transaction for better reliability
    console.log('Joining game with update...');
    await update(gameRef, {
      guestId,
      guestName,
      gameStarted: true,
      lastUpdated: Date.now(),
      lastActionId: generateActionId()
    });
    
    console.log('Successfully joined game!');
    return true;
  } catch (error) {
    console.error('Error joining game:', error);
    return false;
  }
};

// Subscribe to game state changes
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

// Mark player as disconnected
export const markPlayerDisconnected = async (
  gameId: string,
  playerRole: 'host' | 'guest'
): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  await update(gameRef, {
    [`${playerRole}Disconnected`]: true
  });
};

// Update game state with transaction to prevent race conditions
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

// Delete a game
export const deleteGame = async (gameId: string): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  await remove(gameRef);
};

// Clean up old games (older than 24 hours)
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
