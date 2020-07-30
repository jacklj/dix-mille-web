import GameLogic from './GameLogic';

describe('Game Logic', () => {
  describe('getValidScoringGroups', () => {
    it('should return the correct scoring set for 3 of a kind', () => {
      const selectedDice = { a: 5, d: 5, e: 5 };

      const res = GameLogic.getValidScoringGroups(selectedDice);
      expect(res.isValidGroup).toEqual(true);
      expect(res.groupType).toEqual('threeOfAKind');
      expect(res.score).toEqual(500);
      expect(res.scoringGroupDice).toEqual({ a: 5, d: 5, e: 5 }); // toEqual is deep (object) equality test
    });
    // it('should return false if all the selected dice dont make scoring groups', () => {
    //   const selectedDice = {
    //     a: 5,
    //     b: 5,
    //     e: 4
    //   };

    //   const res = GameLogic.getValidScoringGroups(selectedDice);
    //   expect(res.isValidGroup).toEqual(false);
    // });
  });
});
