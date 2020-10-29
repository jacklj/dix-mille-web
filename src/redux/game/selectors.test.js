import { selectTurnScoreSoFar } from './selectors';

describe('Game Selectors', () => {
  describe('selectTurnScoreSoFar', () => {
    it('should handle two throws to double it', () => {
      const state = {
        auth: {
          uid: 'uid123',
        },
        game: {
          currentRound: 0,
          currentTurn: 0,
          rounds: [
            {
              turns: [
                {
                  // player: 'uid1',
                  rolls: [
                    {
                      rollType: 'INITIAL',
                      rollState: 'FINISHED_THEN_ROLLED_AGAIN',
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
                      rollType: 'TWO_THROWS_TO_DOUBLE_IT.FIRST',
                      rollState: 'FINISHED_THEN_ROLLED_AGAIN',
                      roll: {
                        b: 4,
                      },
                    },
                    {
                      rollType: 'TWO_THROWS_TO_DOUBLE_IT.SECOND',
                      rollState: 'FINISHED_THEN_ROLLED_AGAIN',
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
        ui: {
          isShakingCupLocal: false,
        },
      };

      const turnScore = selectTurnScoreSoFar(state);
      expect(turnScore).toEqual(2500);
    });
  });
});
