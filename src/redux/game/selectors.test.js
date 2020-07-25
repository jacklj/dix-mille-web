import { selectTurnScoreSoFar } from './selectors';

describe('Game Selectors', () => {
  describe('selectTurnScoreSoFar', () => {
    it('should handle two throws to double it', () => {
      const state = {
        game: {
          currentRound: 0,
          currentTurn: 0,
          rounds: [
            {
              turns: [
                {
                  player: 'uid1',
                  rolls: [
                    {
                      isBlapped: false,
                      roll: {
                        a: 1,
                        b: 2,
                        c: 1,
                        d: 5,
                        e: 1,
                        f: 1,
                      },
                      scoringGroups: {
                        key1: {
                          groupType: 'threeOfAKind',
                          score: 1000,
                          dice: {
                            a: 1,
                            c: 1,
                            e: 1,
                          },
                        },
                        key2: {
                          groupType: 'oneOrFive',
                          score: 100,
                          dice: {
                            f: 1,
                          },
                        },
                        key3: {
                          groupType: 'oneOrFive',
                          score: 50,
                          dice: {
                            d: 5,
                          },
                        },
                      },
                    },
                    {
                      isBlapped: false,
                      twoThrowsToDoubleIt: 1,
                      roll: {
                        b: 4,
                      },
                    },
                    {
                      isBlapped: false,
                      twoThrowsToDoubleIt: 2,
                      roll: {
                        b: 1,
                      },
                      scoringGroups: {
                        key1: {
                          groupType: 'oneOrFive',
                          score: 100,
                          dice: {
                            b: 1,
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      const turnScore = selectTurnScoreSoFar(state);
      expect(turnScore).toEqual(2500);
    });
  });
});
