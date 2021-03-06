import GameLogic from './GameLogic';

describe('Game Logic', () => {
  describe('getHighestScoringGrouping', () => {
    it('should return the correct result for 6 4s', () => {
      const bankedDice = { a: 4, b: 4, c: 4, d: 4, e: 4, f: 4 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        {
          dice: { a: 4, b: 4, c: 4, d: 4, e: 4, f: 4 },
          groupType: 'sixOfAKind',
          score: 10000,
        },
      ]);
      expect(res.remainingDice).toEqual({});
    });
    it('should return the correct result for 6 1s', () => {
      const bankedDice = { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        {
          dice: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1 },
          groupType: 'sixOfAKind',
          score: 10000,
        },
      ]);
      expect(res.remainingDice).toEqual({});
    });
    it('should return the correct result for a run of 6', () => {
      const bankedDice = { a: 3, b: 6, c: 1, d: 5, e: 2, f: 4 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        {
          dice: { a: 3, b: 6, c: 1, d: 5, e: 2, f: 4 },
          groupType: 'run',
          score: 1500,
        },
      ]);
      expect(res.remainingDice).toEqual({});
    });
    it('should return the correct result for 3 pairs', () => {
      const bankedDice = { a: 3, b: 6, c: 3, d: 5, e: 5, f: 6 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        {
          dice: { a: 3, b: 6, c: 3, d: 5, e: 5, f: 6 },
          groupType: 'threePairs',
          score: 1000,
        },
      ]);
      expect(res.remainingDice).toEqual({});
    });
    it('should return the correct result for the 3 pairs exception 111155', () => {
      const bankedDice = { a: 1, b: 5, c: 5, d: 1, e: 1, f: 1 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        {
          dice: { a: 1, d: 1, e: 1 },
          groupType: 'threeOfAKind',
          score: 1000,
        },
        { dice: { f: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { b: 5 }, groupType: 'oneOrFive', score: 50 },
        { dice: { c: 5 }, groupType: 'oneOrFive', score: 50 },
      ]);
      expect(res.remainingDice).toEqual({});
    });
    it('should return the correct result for the 3 pairs exception 111122', () => {
      const bankedDice = { a: 1, b: 2, c: 1, d: 1, e: 2, f: 1 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        {
          dice: { a: 1, c: 1, d: 1 },
          groupType: 'threeOfAKind',
          score: 1000,
        },
        { dice: { f: 1 }, groupType: 'oneOrFive', score: 100 },
      ]);
      expect(res.remainingDice).toEqual({ b: 2, e: 2 });
    });
    it('should return the correct result for 2 sets of 3 of a kind', () => {
      const bankedDice = { a: 1, b: 2, c: 1, d: 1, e: 2, f: 2 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        {
          dice: { a: 1, c: 1, d: 1 },
          groupType: 'threeOfAKind',
          score: 1000,
        },
        {
          dice: { b: 2, e: 2, f: 2 },
          groupType: 'threeOfAKind',
          score: 200,
        },
      ]);
      expect(res.remainingDice).toEqual({});
    });
    it('should return the correct result for 1 set of 3 of a kind', () => {
      const bankedDice = { a: 5, b: 5, c: 5, d: 2, e: 3, f: 3 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        {
          dice: { a: 5, b: 5, c: 5 },
          groupType: 'threeOfAKind',
          score: 500,
        },
      ]);
      expect(res.remainingDice).toEqual({ d: 2, e: 3, f: 3 });
    });
    it('should return the correct result for 1 set of 3 of a kind when there are more than 3 dice of that value', () => {
      const bankedDice = { a: 3, b: 3, c: 4, d: 3, e: 3, f: 3 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        {
          dice: { a: 3, b: 3, d: 3 },
          groupType: 'threeOfAKind',
          score: 300,
        },
      ]);
      expect(res.remainingDice).toEqual({ c: 4, e: 3, f: 3 });
    });
    it('should return the correct result for 2 1s and a 5', () => {
      const bankedDice = { a: 3, b: 1, c: 4, d: 1, e: 5, f: 3 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        { dice: { b: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { d: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { e: 5 }, groupType: 'oneOrFive', score: 50 },
      ]);
      expect(res.remainingDice).toEqual({ a: 3, c: 4, f: 3 });
    });
    it('should return the correct result for 115552', () => {
      const bankedDice = { a: 5, b: 1, c: 5, d: 1, e: 5, f: 2 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        { dice: { a: 5, c: 5, e: 5 }, groupType: 'threeOfAKind', score: 500 },
        { dice: { b: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { d: 1 }, groupType: 'oneOrFive', score: 100 },
      ]);
      expect(res.remainingDice).toEqual({ f: 2 });
    });
    it('should return the correct result for 11', () => {
      const bankedDice = { a: 1, e: 1 };

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([
        { dice: { a: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { e: 1 }, groupType: 'oneOrFive', score: 100 },
      ]);
      expect(res.remainingDice).toEqual({});
    });
    it('should return nothing if empty set passed', () => {
      const bankedDice = {};

      const res = GameLogic.getHighestScoringGrouping(bankedDice);
      expect(res.groups).toEqual([]);
      expect(res.remainingDice).toEqual({});
    });
  });
});
