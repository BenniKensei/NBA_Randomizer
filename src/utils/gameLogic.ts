// Game logic utilities

import { POSITIONS } from '@/constants/gameData';
import { Roster } from '@/types';

/**
 * Calculate current player based on pick index
 */
export const getCurrentPlayer = (pickIndex: number): 1 | 2 => {
  return (pickIndex % 2 === 0 ? 1 : 2) as 1 | 2;
};

/**
 * Calculate number of picks made by current player
 */
export const getPicksPerPlayer = (pickIndex: number): number => {
  return Math.floor(pickIndex / 2) + (pickIndex % 2);
};

/**
 * Get available (unfilled) positions for a roster
 */
export const getAvailablePositions = (roster: Roster): string[] => {
  return POSITIONS.filter((_, idx) => roster[idx] === null);
};

/**
 * Check if game is complete (all picks made)
 */
export const isGameComplete = (pickIndex: number): boolean => {
  return pickIndex >= 11;
};

/**
 * Calculate current round number
 */
export const getCurrentRound = (pickIndex: number): number => {
  return Math.floor(pickIndex / 2) + 1;
};

/**
 * Get random item from array
 */
export const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};
