import GameLogic from './GameLogic';

describe('Game Logic', () => {
  describe('getValidScoringGroups', () => {
    it('should return the correct scoring groups for a single 1', () => {
      const selectedDice = { b: 1 };

      const res = GameLogic.getValidScoringGroups(selectedDice);
      expect(res.isValidGroups).toEqual(true);
      // toEqual is deep (object) equality test
      expect(res.groups).toEqual([
        { groupType: 'oneOrFive', score: 100, dice: { b: 1 } },
      ]);
    });

    it('should return the correct scoring groups for 3 of a kind', () => {
      const selectedDice = { a: 5, d: 5, e: 5 };

      const res = GameLogic.getValidScoringGroups(selectedDice);
      expect(res.isValidGroups).toEqual(true);
      expect(res.groups).toEqual([
        { groupType: 'threeOfAKind', score: 500, dice: { a: 5, d: 5, e: 5 } },
      ]);
    });

    it('should return false if all the selected dice dont make scoring groups', () => {
      const selectedDice = { a: 5, b: 5, e: 4 };

      const res = GameLogic.getValidScoringGroups(selectedDice);
      expect(res.isValidGroups).toEqual(false);
    });

    it('should return the correct scoring groups for 5 dice', () => {
      const selectedDice = { a: 5, b: 1, d: 5, e: 5, f: 1 };

      const res = GameLogic.getValidScoringGroups(selectedDice);
      expect(res.isValidGroups).toEqual(true);
      expect(res.groups).toEqual([
        { dice: { b: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { f: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { a: 5, d: 5, e: 5 }, groupType: 'threeOfAKind', score: 500 },
      ]);
    });

    it('should return the correct scoring groups for 6 dice', () => {
      const selectedDice = { a: 3, b: 1, c: 3, d: 5, e: 3, f: 1 };

      const res = GameLogic.getValidScoringGroups(selectedDice);
      expect(res.isValidGroups).toEqual(true);
      expect(res.groups).toEqual([
        { dice: { b: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { f: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { d: 5 }, groupType: 'oneOrFive', score: 50 },
        { dice: { a: 3, c: 3, e: 3 }, groupType: 'threeOfAKind', score: 300 },
      ]);
    });

    it('should always return the highest scoring combination of groups (even with 3 pairs possibility)', () => {
      const selectedDice = { a: 5, b: 1, c: 1, d: 5, e: 1, f: 1 };

      const res = GameLogic.getValidScoringGroups(selectedDice);
      expect(res.isValidGroups).toEqual(true);
      expect(res.groups).toEqual([
        { dice: { b: 1 }, groupType: 'oneOrFive', score: 100 },
        { dice: { a: 5 }, groupType: 'oneOrFive', score: 50 },
        { dice: { d: 5 }, groupType: 'oneOrFive', score: 50 },
        { dice: { c: 1, e: 1, f: 1 }, groupType: 'threeOfAKind', score: 1000 },
      ]);
    });
  });

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
          dice: { a: 1, d: 1, e: 1 },
          groupType: 'threeOfAKind',
          score: 1000,
        },
        { dice: { f: 1 }, groupType: 'oneOrFive', score: 100 },
      ]);
      expect(res.remainingDice).toEqual({ b: 2, e: 2 });
    });
  });
});
