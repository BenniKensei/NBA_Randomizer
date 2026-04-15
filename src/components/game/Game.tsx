'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, Home, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { RosterDisplay } from '@/components/game/RosterDisplay';
import { StartScreen } from '@/components/game/StartScreen';
import { EndScreen } from '@/components/game/EndScreen';
import { SpinnerCard } from '@/components/game/SpinnerCard';
import { TEAMS, ERAS, POSITIONS } from '@/constants/gameData';
import { SpinResult, Player, Roster } from '@/types';
import { buttonPress } from '@/lib/animations';
import { validatePlayerTeam, getPlayerByName } from '@/constants/nbaPlayers';
import { getTeamAbbreviation } from '@/utils/teamMapping';
import {
  createMultiplayerGame,
  joinMultiplayerGame,
  subscribeToGame,
  updateGameState,
  generatePlayerId,
  generateActionId,
  markPlayerDisconnected
} from '@/utils/multiplayer';
import { MultiplayerGameState } from '@/types/multiplayer';

/**
 * Main game controller for both local hot-seat play and Firebase-backed
 * multiplayer. The component keeps the draft flow, roster validation,
 * rematch logic, and synchronization concerns in one place so the UI layer
 * stays predictable even when the game state changes from remote updates.
 */
export default function Game() {
  // Multiplayer State
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [multiplayerGameId, setMultiplayerGameId] = useState<string | null>(null);
  const [playerId] = useState(() => generatePlayerId());
  const [isWaitingForPlayer, setIsWaitingForPlayer] = useState(false);
  const [playerRole, setPlayerRole] = useState<'host' | 'guest' | null>(null);
  const [hostName, setHostName] = useState<string>('Player 1');
  const [guestName, setGuestName] = useState<string>('Player 2');
  const [firstPlayer, setFirstPlayer] = useState<1 | 2>(1);
  
  // Refs to prevent sync loops
  const lastSyncedActionId = useRef<string | null>(null);
  const lastReceivedActionId = useRef<string | null>(null);
  const isSyncingRef = useRef(false);
  
  // Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [pickIndex, setPickIndex] = useState(0);
  const [p1Roster, setP1Roster] = useState<Roster>(Array(6).fill(null));
  const [p2Roster, setP2Roster] = useState<Roster>(Array(6).fill(null));
  const [gameFinished, setGameFinished] = useState(false);
  const [activeEras, setActiveEras] = useState<string[]>(ERAS);
  const [noDuplicatesMode, setNoDuplicatesMode] = useState(false);
  const [usedTeams, setUsedTeams] = useState<string[]>([]);
  const [p1SkipUsed, setP1SkipUsed] = useState(false);
  const [p2SkipUsed, setP2SkipUsed] = useState(false);
  const [p1MoveUsed, setP1MoveUsed] = useState(false);
  const [p2MoveUsed, setP2MoveUsed] = useState(false);
  const [selectedPlayerToMove, setSelectedPlayerToMove] = useState<number | null>(null);
  const [skipEnabled, setSkipEnabled] = useState(true);
  const [moveEnabled, setMoveEnabled] = useState(true);

  // Spin State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [draftInput, setDraftInput] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Derived State
  // These values are derived from the current draft index so the UI never
  // stores redundant turn information that can drift out of sync.
  const currentPlayer = (pickIndex % 2 === 0 ? 1 : 2) as 1 | 2;
  const picksPerPlayer = Math.floor(pickIndex / 2) + (pickIndex % 2);
  const currentRoster = currentPlayer === 1 ? p1Roster : p2Roster;
  
  // Firebase converts null to undefined in arrays, so check for both
  const availablePositions = (currentRoster && Array.isArray(currentRoster)) 
    ? POSITIONS.filter((_, idx) => currentRoster[idx] === null || currentRoster[idx] === undefined)
    : POSITIONS;
  
  // In online mode, determine if it's this player's turn
  const myPlayerNumber = isOnlineMode ? (playerRole === 'host' ? 1 : 2) : null;
  const isMyTurn = isOnlineMode ? currentPlayer === myPlayerNumber : true;

  // Refs for animation intervals
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load game state from localStorage (only for local mode)
  useEffect(() => {
    if (isOnlineMode) return; // Don't use localStorage in online mode
    
    const savedState = localStorage.getItem('nba-draft-game');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameStarted(parsed.gameStarted || false);
        setPickIndex(parsed.pickIndex || 0);
        setP1Roster(parsed.p1Roster || Array(6).fill(null));
        setP2Roster(parsed.p2Roster || Array(6).fill(null));
        setGameFinished(parsed.gameFinished || false);
      } catch (e) {
        console.error('Failed to load saved game:', e);
      }
    }
  }, []);

  // URL auto-join removed - players must use game code to join with proper names

  // Persist only the local draft state so browser refreshes do not wipe an
  // in-progress single-device game. Multiplayer state is intentionally left
  // out because Firebase is the source of truth there.
  useEffect(() => {
    if (isOnlineMode) return; // Don't use localStorage in online mode
    
    if (gameStarted || gameFinished) {
      localStorage.setItem('nba-draft-game', JSON.stringify({
        gameStarted,
        pickIndex,
        p1Roster,
        p2Roster,
        gameFinished
      }));
    }
  }, [gameStarted, pickIndex, p1Roster, p2Roster, gameFinished, isOnlineMode]);

  /**
   * Resets the local game session and applies the selected ruleset.
   * The optional parameters are kept loose because the start screen can
   * launch a fresh game from several different entry points.
   */
  const startGame = (selectedEras?: string[], noDuplicates?: boolean, skipEnabledSetting?: boolean, moveEnabledSetting?: boolean) => {
    // If starting a new local game while in online mode, disconnect from online game
    if (isOnlineMode && multiplayerGameId && playerRole) {
      markPlayerDisconnected(multiplayerGameId, playerRole);
      setIsOnlineMode(false);
      setMultiplayerGameId(null);
      setIsWaitingForPlayer(false);
      setPlayerRole(null);
    }
    
    setGameStarted(true);
    setPickIndex(0);
    setP1Roster(Array(6).fill(null));
    setP2Roster(Array(6).fill(null));
    setGameFinished(false);
    setSpinResult(null);
    setDraftInput("");
    setSelectedPosition(null);
    setUsedTeams([]);
    setP1SkipUsed(false);
    setP2SkipUsed(false);
    setP1MoveUsed(false);
    setP2MoveUsed(false);
    setSelectedPlayerToMove(null);
    if (selectedEras) {
      setActiveEras(selectedEras);
    }
    if (noDuplicates !== undefined) {
      setNoDuplicatesMode(noDuplicates);
    }
    if (skipEnabledSetting !== undefined) {
      setSkipEnabled(skipEnabledSetting);
    }
    if (moveEnabledSetting !== undefined) {
      setMoveEnabled(moveEnabledSetting);
    }
  };

  // Multiplayer Functions
  // These functions isolate session lifecycle concerns from the render tree so
  // reconnects, rematches, and disconnects do not leak state between games.
  const createOnlineGame = async (playerName: string) => {
    // If creating a new online game while in another online game, disconnect from the old one
    if (isOnlineMode && multiplayerGameId && playerRole) {
      await markPlayerDisconnected(multiplayerGameId, playerRole);
    }
    
    // Clear localStorage for online mode
    localStorage.removeItem('nba-draft-game');
    
    // Reset all states completely
    setGameStarted(false);
    setGameFinished(false);
    setP1Roster(Array(6).fill(null));
    setP2Roster(Array(6).fill(null));
    setPickIndex(0);
    setUsedTeams([]);
    setP1SkipUsed(false);
    setP2SkipUsed(false);
    setP1MoveUsed(false);
    setP2MoveUsed(false);
    setSpinResult(null);
    setSelectedPosition(null);
    setDraftInput("");
    setSelectedPlayerToMove(null);
    setHostName(playerName);
    setGuestName('Player 2');
    
    setIsOnlineMode(true);
    setPlayerRole('host');
    setIsWaitingForPlayer(true);
    
    const gameId = await createMultiplayerGame(playerId, {
      activeEras,
      noDuplicatesMode,
      skipEnabled,
      moveEnabled
    }, playerName);
    
    setMultiplayerGameId(gameId);
    
    // Subscribe to game updates
    const unsubscribe = subscribeToGame(gameId, (gameState) => {
      if (!gameState) {
        // Game was deleted
        alert('Game has ended or was deleted.');
        cleanupMultiplayerSession();
        return;
      }
      
      // Check if guest disconnected
      if (gameState.guestDisconnected) {
        alert('Your opponent has left the game.');
        cleanupMultiplayerSession();
        return;
      }
      
      // Update local state from Firebase
      if (gameState.guestId) {
        setIsWaitingForPlayer(false);
        setGameStarted(true);
      }
      
      syncGameState(gameState);
    });
    
    // Store unsubscribe function
    return unsubscribe;
  };

  const joinOnlineGame = async (gameId: string, playerName: string) => {
    try {
      // If joining a new online game while in another online game, disconnect from the old one
      if (isOnlineMode && multiplayerGameId && playerRole && multiplayerGameId !== gameId) {
        await markPlayerDisconnected(multiplayerGameId, playerRole);
      }
      
      const success = await joinMultiplayerGame(gameId, playerId, playerName);
      
      if (!success) {
        console.error('Failed to join game:', gameId);
        alert('Could not join game. Game may not exist or is already full.');
        return;
      }
    
      // Clear localStorage for online mode
      localStorage.removeItem('nba-draft-game');
      
      // Reset all states completely
      setGameStarted(true);
      setGameFinished(false);
      setP1Roster(Array(6).fill(null));
      setP2Roster(Array(6).fill(null));
      setPickIndex(0);
      setUsedTeams([]);
      setP1SkipUsed(false);
      setP2SkipUsed(false);
      setP1MoveUsed(false);
      setP2MoveUsed(false);
      setSpinResult(null);
      setSelectedPosition(null);
      setDraftInput("");
      setSelectedPlayerToMove(null);
      setIsWaitingForPlayer(false);
      setGuestName(playerName);
      setHostName('Player 1');
      
      setIsOnlineMode(true);
      setPlayerRole('guest');
      setMultiplayerGameId(gameId);
      
      // Subscribe to game updates
      const unsubscribe = subscribeToGame(gameId, (gameState) => {
        if (!gameState) {
          // Game was deleted
          alert('Game has ended or was deleted.');
          cleanupMultiplayerSession();
          return;
        }
        
        // Check if host disconnected
        if (gameState.hostDisconnected) {
          alert('Your opponent has left the game.');
          cleanupMultiplayerSession();
          return;
        }
        
        syncGameState(gameState);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error joining game:', error);
      alert('Failed to join game. Please try again.');
    }
  };

  const syncGameState = (gameState: MultiplayerGameState) => {
    // Prevent sync loops by ignoring updates we originated locally.
    if (gameState.lastActionId === lastSyncedActionId.current) {
      return;
    }
    
    // Prevent duplicate processing
    if (gameState.lastActionId === lastReceivedActionId.current) {
      return;
    }
    
    // Mark this action as received
    lastReceivedActionId.current = gameState.lastActionId;
    
    // Sync player names if available
    if (gameState.hostName) setHostName(gameState.hostName);
    if (gameState.guestName) setGuestName(gameState.guestName);
    if (gameState.firstPlayer) setFirstPlayer(gameState.firstPlayer);
    
    // Sync game settings from Firebase
    if (gameState.activeEras) setActiveEras(gameState.activeEras);
    if (gameState.noDuplicatesMode !== undefined) setNoDuplicatesMode(gameState.noDuplicatesMode);
    if (gameState.skipEnabled !== undefined) setSkipEnabled(gameState.skipEnabled);
    if (gameState.moveEnabled !== undefined) setMoveEnabled(gameState.moveEnabled);
    
    // Firebase remains the source of truth for multiplayer rosters because
    // both clients can update the same record via realtime events.
    const newP1Roster = Array.isArray(gameState.p1Roster) ? gameState.p1Roster : Array(6).fill(null);
    const newP2Roster = Array.isArray(gameState.p2Roster) ? gameState.p2Roster : Array(6).fill(null);
    
    setP1Roster(newP1Roster);
    setP2Roster(newP2Roster);
    setPickIndex(gameState.pickIndex || 0);
    
    setGameFinished(gameState.gameFinished || false);
    setUsedTeams(Array.isArray(gameState.usedTeams) ? gameState.usedTeams : []);
    setP1SkipUsed(gameState.p1SkipUsed || false);
    setP2SkipUsed(gameState.p2SkipUsed || false);
    setP1MoveUsed(gameState.p1MoveUsed || false);
    setP2MoveUsed(gameState.p2MoveUsed || false);
    
    // Convert spinResult from Firebase format back to SpinResult
    if (gameState.spinResult) {
      const team = TEAMS.find(t => t.name === gameState.spinResult!.team);
      if (team) {
        setSpinResult({ team, era: gameState.spinResult.era });
      } else {
        setSpinResult(null);
      }
    } else {
      setSpinResult(null);
    }
    
    setSelectedPosition(gameState.selectedPosition || null);
  };

  const syncToFirebase = async (updates: Partial<MultiplayerGameState>) => {
    if (!isOnlineMode || !multiplayerGameId || isSyncingRef.current) return;
    
    isSyncingRef.current = true;
    
    try {
      // Generate a new action ID for this update
      const actionId = generateActionId();
      lastSyncedActionId.current = actionId;
      
      // Update with transaction to prevent race conditions
      const success = await updateGameState(
        multiplayerGameId,
        updates,
        lastReceivedActionId.current || undefined
      );
      
      if (!success) {
        // Firebase update failed or conflicted - subscription will deliver the winning state
      }
    } catch (error) {
      console.error('Error syncing to Firebase:', error);
    } finally {
      isSyncingRef.current = false;
    }
  };

  const backToMenu = () => {
    // In online mode we keep the session alive so a player can leave the game
    // screen temporarily without forcing a disconnect for the other client.
    setGameStarted(false);
    // Don't clear multiplayer state - keep connection active
    
    // Reset all draft state when going back to menu
    setP1Roster(Array(6).fill(null));
    setP2Roster(Array(6).fill(null));
    setPickIndex(0);
    setP1SkipUsed(false);
    setP2SkipUsed(false);
    setP1MoveUsed(false);
    setP2MoveUsed(false);
    setGameFinished(false);
  };
  
  const cleanupMultiplayerSession = () => {
    // Full teardown is reserved for terminal session failures or explicit
    // exits, because it clears both local UI state and the active room data.
    setIsOnlineMode(false);
    setMultiplayerGameId(null);
    setIsWaitingForPlayer(false);
    setPlayerRole(null);
    setGameStarted(false);
    setP1Roster(Array(6).fill(null));
    setP2Roster(Array(6).fill(null));
    setPickIndex(0);
    setP1SkipUsed(false);
    setP2SkipUsed(false);
    setP1MoveUsed(false);
    setP2MoveUsed(false);
    setGameFinished(false);
    setUsedTeams([]);
    setSpinResult(null);
    setSelectedPosition(null);
    setDraftInput("");
    setSelectedPlayerToMove(null);
    setHostName('Player 1');
    setGuestName('Player 2');
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, callback: () => void) => {
    const target = e.currentTarget;
    buttonPress(target);
    setTimeout(callback, 100);
  };

  const handleReset = () => {
    if (isOnlineMode) {
      // In online mode, this is a rematch - clear rosters but keep connection
      if (window.confirm('Request a rematch? Both players\' rosters will be cleared.')) {
        // Alternate starting player for rematch
        const newFirstPlayer = firstPlayer === 1 ? 2 : 1;
        const newPickIndex = newFirstPlayer === 1 ? 0 : 1;
        
        setFirstPlayer(newFirstPlayer);
        setPickIndex(newPickIndex);
        setP1Roster(Array(6).fill(null));
        setP2Roster(Array(6).fill(null));
        setGameFinished(false);
        setUsedTeams([]);
        setP1SkipUsed(false);
        setP2SkipUsed(false);
        setP1MoveUsed(false);
        setP2MoveUsed(false);
        setSelectedPlayerToMove(null);
        setSpinResult(null);
        setDraftInput('');
        setSelectedPosition(null);
        setGameStarted(true); // Keep game started for rematch
        
        // Sync cleared state to Firebase immediately
        syncToFirebase({
          firstPlayer: newFirstPlayer,
          pickIndex: newPickIndex,
          p1Roster: Array(6).fill(null),
          p2Roster: Array(6).fill(null),
          gameFinished: false,
          usedTeams: [],
          p1SkipUsed: false,
          p2SkipUsed: false,
          p1MoveUsed: false,
          p2MoveUsed: false,
          spinResult: null,
          selectedPosition: null,
        });
      }
    } else {
      // Local mode - full reset
      if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
        setPickIndex(0);
        setP1Roster(Array(6).fill(null));
        setP2Roster(Array(6).fill(null));
        setGameFinished(false);
        setUsedTeams([]);
        setP1SkipUsed(false);
        setP2SkipUsed(false);
        setP1MoveUsed(false);
        setP2MoveUsed(false);
        setSelectedPlayerToMove(null);
        setSpinResult(null);
        setDraftInput('');
        setSelectedPosition(null);
        localStorage.removeItem('nba-draft-game');
      }
    }
  };

  const handleSpin = () => {
    // In online mode, only allow spin if it's your turn
    if (isOnlineMode && !isMyTurn) return;
    
    setIsSpinning(true);
    setSpinResult(null);
    
    let counter = 0;
    const maxSpins = 20;
    
    spinIntervalRef.current = setInterval(() => {
      const randomTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      const randomEra = activeEras[Math.floor(Math.random() * activeEras.length)];
      setSpinResult({ team: randomTeam, era: randomEra });
      
      counter++;
      if (counter >= maxSpins) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        finalizeSpin();
      }
    }, 100);
  };

  const finalizeSpin = () => {
    let availableTeams = TEAMS;

    if (noDuplicatesMode) {
      availableTeams = TEAMS.filter(team => !usedTeams.includes(team.name));
      if (availableTeams.length === 0) availableTeams = TEAMS;
    }

    const finalTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    const finalEra = activeEras[Math.floor(Math.random() * activeEras.length)];
    setSpinResult({ team: finalTeam, era: finalEra });
    setIsSpinning(false);
  };

  const submitPick = () => {
    if (!draftInput.trim() || !spinResult || !selectedPosition) return;
    if (isOnlineMode && !isMyTurn) return;

    // Validate player-team match
    const teamAbbr = getTeamAbbreviation(spinResult.team.name);
    const isValid = validatePlayerTeam(draftInput.trim(), teamAbbr);
    
    if (!isValid) {
      const playerExists = getPlayerByName(draftInput.trim());
      if (!playerExists) {
        setValidationError(`${draftInput.trim()} is not in the player database. Please select from the dropdown.`);
      } else {
        setValidationError(`${draftInput.trim()} did not play for the ${spinResult.team.name}`);
      }
      return;
    }
    
    // Check for duplicate players across both rosters
    const playerNameLower = draftInput.trim().toLowerCase();
    const isDuplicateInP1 = p1Roster.some(player => 
      player && player.name.toLowerCase() === playerNameLower
    );
    const isDuplicateInP2 = p2Roster.some(player => 
      player && player.name.toLowerCase() === playerNameLower
    );
    
    if (isDuplicateInP1 || isDuplicateInP2) {
      setValidationError(`${draftInput.trim()} has already been picked!`);
      return;
    }
    
    // Clear validation error if any
    setValidationError(null);

    console.log('=== SUBMIT PICK START ===');
    console.log('Before pick - p1Roster:', p1Roster);
    console.log('Before pick - p2Roster:', p2Roster);
    console.log('currentPlayer:', currentPlayer);
    console.log('selectedPosition:', selectedPosition);

    const posIndex = POSITIONS.indexOf(selectedPosition);
    const pickData: Player = {
      name: draftInput.trim(),
      team: spinResult.team.name,
      era: spinResult.era,
      position: selectedPosition
    };

    let newP1Roster = p1Roster;
    let newP2Roster = p2Roster;
    
    if (currentPlayer === 1) {
      newP1Roster = Array.isArray(p1Roster) ? [...p1Roster] : Array(6).fill(null);
      newP1Roster[posIndex] = pickData;
      console.log('Setting new P1 roster:', newP1Roster);
      setP1Roster(newP1Roster);
    } else {
      newP2Roster = Array.isArray(p2Roster) ? [...p2Roster] : Array(6).fill(null);
      newP2Roster[posIndex] = pickData;
      console.log('Setting new P2 roster:', newP2Roster);
      setP2Roster(newP2Roster);
    }

    const newUsedTeams = noDuplicatesMode ? [...usedTeams, spinResult.team.name] : usedTeams;
    if (noDuplicatesMode) {
      setUsedTeams(newUsedTeams);
    }

    // Clear all input states
    setDraftInput("");
    setSpinResult(null);
    setSelectedPosition(null);
    setValidationError(null);

    const newPickIndex = pickIndex + 1;
    const newGameFinished = pickIndex === 11;
    
    if (newGameFinished) {
      setGameFinished(true);
    } else {
      setPickIndex(newPickIndex);
    }
    
    console.log('After pick - syncing to Firebase:', { newP1Roster, newP2Roster, newPickIndex });
    
    // Sync to Firebase immediately with the new values
    if (isOnlineMode) {
      syncToFirebase({
        p1Roster: newP1Roster,
        p2Roster: newP2Roster,
        pickIndex: newPickIndex,
        gameFinished: newGameFinished,
        usedTeams: newUsedTeams,
        spinResult: null,
        selectedPosition: null,
      });
    }
  };

  const skipTeam = () => {
    const currentSkipUsed = currentPlayer === 1 ? p1SkipUsed : p2SkipUsed;
    if (!spinResult || currentSkipUsed) return;
    if (isOnlineMode && !isMyTurn) return;
    
    let availableTeams = TEAMS.filter(team => team.name !== spinResult.team.name);
    if (noDuplicatesMode) {
      availableTeams = availableTeams.filter(team => !usedTeams.includes(team.name));
    }
    if (availableTeams.length === 0) return;
    
    const newTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    const newSpinResult = { ...spinResult, team: newTeam };
    setSpinResult(newSpinResult);
    
    const newP1SkipUsed = currentPlayer === 1 ? true : p1SkipUsed;
    const newP2SkipUsed = currentPlayer === 2 ? true : p2SkipUsed;
    
    if (currentPlayer === 1) {
      setP1SkipUsed(true);
    } else {
      setP2SkipUsed(true);
    }
    
    // Sync to Firebase immediately
    if (isOnlineMode) {
      syncToFirebase({
        spinResult: { team: newTeam.name, era: newSpinResult.era },
        p1SkipUsed: newP1SkipUsed,
        p2SkipUsed: newP2SkipUsed,
      });
    }
  };

  const skipEra = () => {
    const currentSkipUsed = currentPlayer === 1 ? p1SkipUsed : p2SkipUsed;
    if (!spinResult || currentSkipUsed) return;
    if (isOnlineMode && !isMyTurn) return;
    
    const availableEras = activeEras.filter(era => era !== spinResult.era);
    if (availableEras.length === 0) return;
    
    const newEra = availableEras[Math.floor(Math.random() * availableEras.length)];
    const newSpinResult = { ...spinResult, era: newEra };
    setSpinResult(newSpinResult);
    
    const newP1SkipUsed = currentPlayer === 1 ? true : p1SkipUsed;
    const newP2SkipUsed = currentPlayer === 2 ? true : p2SkipUsed;
    
    if (currentPlayer === 1) {
      setP1SkipUsed(true);
    } else {
      setP2SkipUsed(true);
    }
    
    // Sync to Firebase immediately
    if (isOnlineMode) {
      syncToFirebase({
        spinResult: { team: newSpinResult.team.name, era: newEra },
        p1SkipUsed: newP1SkipUsed,
        p2SkipUsed: newP2SkipUsed,
      });
    }
  };

  const handleMovePlayer = (fromIndex: number, toIndex: number) => {
    if (gameFinished) return;
    if (isOnlineMode && !isMyTurn) return;
    
    const moveUsed = currentPlayer === 1 ? p1MoveUsed : p2MoveUsed;
    if (moveUsed) return;

    const currentRosterState = currentPlayer === 1 ? p1Roster : p2Roster;
    
    // Check if source has a player and destination is empty
    if (!currentRosterState[fromIndex] || currentRosterState[toIndex]) return;

    const newRoster = [...currentRosterState];
    const player = newRoster[fromIndex]!;
    
    // Update player's position
    newRoster[toIndex] = { ...player, position: POSITIONS[toIndex] };
    newRoster[fromIndex] = null;

    const newP1MoveUsed = currentPlayer === 1 ? true : p1MoveUsed;
    const newP2MoveUsed = currentPlayer === 2 ? true : p2MoveUsed;

    if (currentPlayer === 1) {
      setP1Roster(newRoster);
      setP1MoveUsed(true);
    } else {
      setP2Roster(newRoster);
      setP2MoveUsed(true);
    }

    setSelectedPlayerToMove(null);
    
    // Sync to Firebase immediately
    if (isOnlineMode) {
      syncToFirebase({
        p1Roster: currentPlayer === 1 ? newRoster : p1Roster,
        p2Roster: currentPlayer === 2 ? newRoster : p2Roster,
        p1MoveUsed: newP1MoveUsed,
        p2MoveUsed: newP2MoveUsed,
      });
    }
  };

  // Clean up intervals
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    };
  }, []);

  // Render Views
  if (!gameStarted) {
    const hasStartedDraft = !gameFinished && (pickIndex > 0 || p1Roster.some(p => p !== null) || p2Roster.some(p => p !== null));
    // Generate URL format for consistency, but UI will only show the game code
    const multiplayerUrl = multiplayerGameId ? `?game=${multiplayerGameId}` : undefined;
    const hasActiveOnlineGame = isOnlineMode && multiplayerGameId !== null;
    
    return (
      <StartScreen 
        onStart={startGame} 
        hasStartedDraft={hasStartedDraft} 
        onContinue={() => setGameStarted(true)}
        onCreateOnlineGame={createOnlineGame}
        onJoinOnlineGame={joinOnlineGame}
        multiplayerGameUrl={multiplayerUrl}
        isWaitingForPlayer={isWaitingForPlayer}
        hasActiveOnlineGame={hasActiveOnlineGame}
      />
    );
  }

  if (gameFinished) {
    const handlePlayAgain = () => {
      if (isOnlineMode) {
        // In online mode, trigger rematch
        handleReset();
      } else {
        // In local mode, start new game
        startGame();
      }
    };
    
    return <EndScreen p1Roster={p1Roster} p2Roster={p2Roster} onRestart={handlePlayAgain} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-50 to-red-100 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 font-bold text-slate-800">
            <Users size={20} className="text-orange-500" />
            <span>Round {Math.floor(pickIndex / 2) + 1}/6</span>
          </div>
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div className="font-black text-xl tracking-tighter text-slate-900">NBA RANDOMIZER</div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => handleButtonClick(e, handleReset)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 border border-slate-300 hover:border-red-300 active:scale-95"
            >
              <RotateCcw size={16} />
              <span>{isOnlineMode ? 'Rematch' : 'Reset'}</span>
            </button>
            <button 
              onClick={(e) => handleButtonClick(e, backToMenu)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 border border-slate-300 hover:border-blue-300 active:scale-95"
            >
              <Home size={16} />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Roster (Player 1) */}
          <div className="hidden lg:flex lg:flex-col lg:col-span-3">
            <Card className="p-4 flex-1 border-t-4 border-t-blue-500 shadow-xl overflow-y-auto">
              <RosterDisplay 
                playerNum={1} 
                roster={p1Roster} 
                gameFinished={gameFinished}
                gameStarted={gameStarted}
                pickIndex={pickIndex}
                onMovePlayer={handleMovePlayer}
                moveUsed={p1MoveUsed}
                selectedPlayerToMove={selectedPlayerToMove}
                setSelectedPlayerToMove={setSelectedPlayerToMove}
                currentPlayer={currentPlayer}
                moveEnabled={moveEnabled}
                isOnlineMode={isOnlineMode}
                myPlayerNumber={myPlayerNumber}
                playerName={hostName}
              />
            </Card>
            
            {/* Player 1 Actions Panel */}
            {(skipEnabled || moveEnabled) && (
            <Card className="p-3 flex-shrink-0 border-l-4 border-l-blue-500 shadow-lg">
              <div className="space-y-2">
                {skipEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">SKIP</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${p1SkipUsed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-blue-100 text-blue-700'}`}>
                    {p1SkipUsed ? 'Used' : 'Available'}
                  </span>
                </div>
                )}
                {moveEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">MOVE</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${p1MoveUsed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-blue-100 text-blue-700'}`}>
                    {p1MoveUsed ? 'Used' : 'Available'}
                  </span>
                </div>
                )}
              </div>
            </Card>
            )}
          </div>

          {/* Center Action Zone */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Turn Indicator */}
            <div className={`
              text-center py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top
              ${currentPlayer === 1 ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-red-600 to-red-500'}
            `}>
              <span className="text-lg">Player {currentPlayer}&apos;s Turn to Draft</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg ml-3 text-base font-black">
                Pick {picksPerPlayer}/6
              </span>
            </div>

            {/* The Randomizer Card */}
            <SpinnerCard
              isSpinning={isSpinning}
              spinResult={spinResult}
              selectedPosition={selectedPosition}
              availablePositions={availablePositions}
              draftInput={draftInput}
              onSpin={handleSpin}
              onInputChange={(value) => {
                setDraftInput(value);
                setValidationError(null); // Clear error when typing
              }}
              onPositionSelect={setSelectedPosition}
              onSubmit={submitPick}
              onSkipTeam={skipTeam}
              onSkipEra={skipEra}
              skipUsed={currentPlayer === 1 ? p1SkipUsed : p2SkipUsed}
              skipEnabled={skipEnabled}
              disabled={isOnlineMode && !isMyTurn}
              validationError={validationError}
            />

            {/* Mobile View Rosters */}
            <div className="lg:hidden grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border-2 border-blue-200 shadow-md">
                <div className="text-center font-bold text-blue-800 text-sm mb-2">{hostName}</div>
                {Array.isArray(p1Roster) && p1Roster.map((p, i) => (
                  <div 
                    key={i} 
                    className={`text-xs p-2 mb-1 rounded transition-all ${
                      p ? 'bg-white shadow-sm font-medium' : 'bg-blue-100 text-blue-300'
                    }`}
                  >
                    {p ? `${POSITIONS[i]}: ${p.name}` : `${POSITIONS[i]}: -`}
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border-2 border-red-200 shadow-md">
                <div className="text-center font-bold text-red-800 text-sm mb-2">{guestName}</div>
                {Array.isArray(p2Roster) && p2Roster.map((p, i) => (
                  <div 
                    key={i} 
                    className={`text-xs p-2 mb-1 rounded transition-all ${
                      p ? 'bg-white shadow-sm font-medium' : 'bg-red-100 text-red-300'
                    }`}
                  >
                    {p ? `${POSITIONS[i]}: ${p.name}` : `${POSITIONS[i]}: -`}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Roster (Player 2) */}
          <div className="hidden lg:flex lg:flex-col lg:col-span-3">
            <Card className="p-4 flex-1 border-t-4 border-t-red-500 shadow-xl overflow-y-auto">
              <RosterDisplay 
                playerNum={2}
                roster={p2Roster}
                gameFinished={gameFinished}
                gameStarted={gameStarted}
                pickIndex={pickIndex}
                onMovePlayer={handleMovePlayer}
                moveUsed={p2MoveUsed}
                selectedPlayerToMove={selectedPlayerToMove}
                setSelectedPlayerToMove={setSelectedPlayerToMove}
                currentPlayer={currentPlayer}
                moveEnabled={moveEnabled}
                isOnlineMode={isOnlineMode}
                myPlayerNumber={myPlayerNumber}
                playerName={guestName}
              />
            </Card>
            
            {/* Player 2 Actions Panel */}
            {(skipEnabled || moveEnabled) && (
            <Card className="p-3 flex-shrink-0 border-l-4 border-l-red-500 shadow-lg">
              <div className="space-y-2">
                {skipEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">SKIP</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${p2SkipUsed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-red-100 text-red-700'}`}>
                    {p2SkipUsed ? 'Used' : 'Available'}
                  </span>
                </div>
                )}
                {moveEnabled && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">MOVE</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${p2MoveUsed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-red-100 text-red-700'}`}>
                    {p2MoveUsed ? 'Used' : 'Available'}
                  </span>
                </div>
                )}
              </div>
            </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
