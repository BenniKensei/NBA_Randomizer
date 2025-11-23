export interface Team {
  name: string;
  color: string;
}

export interface Player {
  name: string;
  team: string;
  era: string;
  position: string;
}

export interface SpinResult {
  team: Team;
  era: string;
}

export type Roster = (Player | null)[];

export interface GameState {
  gameStarted: boolean;
  pickIndex: number;
  p1Roster: Roster;
  p2Roster: Roster;
  gameFinished: boolean;
}
