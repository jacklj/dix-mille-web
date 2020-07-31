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
  });
});
