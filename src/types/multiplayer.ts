import { Roster } from './index';

export interface MultiplayerGameState {
  gameId: string;
  hostId: string;
  guestId: string | null;
  gameStarted: boolean;
  pickIndex: number;
  p1Roster: Roster;
  p2Roster: Roster;
  gameFinished: boolean;
  activeEras: string[];
  noDuplicatesMode: boolean;
  usedTeams: string[];
  p1SkipUsed: boolean;
  p2SkipUsed: boolean;
  p1MoveUsed: boolean;
  p2MoveUsed: boolean;
  skipEnabled: boolean;
  moveEnabled: boolean;
  spinResult: { team: string; era: string } | null;
  selectedPosition: string | null;
  createdAt: number;
  lastUpdated: number;
  lastActionId: string;
  hostDisconnected?: boolean;
  guestDisconnected?: boolean;
}

export interface MultiplayerSession {
  gameId: string;
  playerRole: 'host' | 'guest';
  playerId: string;
}
