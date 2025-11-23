import { ref, set, onValue, update, get, remove } from 'firebase/database';
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

// Create a new multiplayer game
export const createMultiplayerGame = async (
  hostId: string,
  gameSettings: {
    activeEras: string[];
    noDuplicatesMode: boolean;
    skipEnabled: boolean;
    moveEnabled: boolean;
  }
): Promise<string> => {
  const gameId = generateGameId();
  const gameRef = ref(database, `games/${gameId}`);
  
  const initialState: MultiplayerGameState = {
    gameId,
    hostId,
    guestId: null,
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
    createdAt: Date.now()
  };
  
  await set(gameRef, initialState);
  return gameId;
};

// Join an existing multiplayer game
export const joinMultiplayerGame = async (
  gameId: string,
  guestId: string
): Promise<boolean> => {
  const gameRef = ref(database, `games/${gameId}`);
  
  try {
    const snapshot = await get(gameRef);
    if (!snapshot.exists()) {
      return false;
    }
    
    const gameData = snapshot.val() as MultiplayerGameState;
    
    // Check if game is already full
    if (gameData.guestId) {
      return false;
    }
    
    // Add guest player
    await update(gameRef, {
      guestId,
      gameStarted: true
    });
    
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
      callback(snapshot.val() as MultiplayerGameState);
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

// Update game state
export const updateGameState = async (
  gameId: string,
  updates: Partial<MultiplayerGameState>
): Promise<void> => {
  const gameRef = ref(database, `games/${gameId}`);
  await update(gameRef, updates);
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
