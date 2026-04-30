import {
  getCurrentPlayer,
  getPicksPerPlayer,
  isGameComplete,
  getCurrentRound,
} from './gameLogic';

describe('Game Logic Utilities', () => {
  describe('getCurrentPlayer', () => {
    it('returns player 1 for even indices', () => {
      expect(getCurrentPlayer(0)).toBe(1);
      expect(getCurrentPlayer(2)).toBe(1);
      expect(getCurrentPlayer(4)).toBe(1);
    });

    it('returns player 2 for odd indices', () => {
      expect(getCurrentPlayer(1)).toBe(2);
      expect(getCurrentPlayer(3)).toBe(2);
      expect(getCurrentPlayer(5)).toBe(2);
    });
  });

  describe('getPicksPerPlayer', () => {
    it('calculates correct number of picks', () => {
      expect(getPicksPerPlayer(0)).toBe(0);
      expect(getPicksPerPlayer(1)).toBe(1);
      expect(getPicksPerPlayer(2)).toBe(1);
      expect(getPicksPerPlayer(3)).toBe(2);
      expect(getPicksPerPlayer(4)).toBe(2);
    });
  });

  describe('isGameComplete', () => {
    it('returns true when 11 or more picks are made', () => {
      expect(isGameComplete(10)).toBe(false);
      expect(isGameComplete(11)).toBe(true);
      expect(isGameComplete(12)).toBe(true);
    });
  });

  describe('getCurrentRound', () => {
    it('calculates the current round correctly', () => {
      expect(getCurrentRound(0)).toBe(1);
      expect(getCurrentRound(1)).toBe(1);
      expect(getCurrentRound(2)).toBe(2);
      expect(getCurrentRound(3)).toBe(2);
      expect(getCurrentRound(4)).toBe(3);
    });
  });
});
