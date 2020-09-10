import Constants from './constants';

const areArraysEqual = (a, b) => a.every((value, index) => value === b[index]);

const getValidScoringGroups = (selectedDice) => {
  // selectedDice is a map of dice, e.g. { b: 5, c: 5, e: 5 }
  const numberOfDice = Object.keys(selectedDice).length;
  const diceValues = Object.values(selectedDice);

  const is1or5 =
    numberOfDice === 1 && (diceValues[0] === 1 || diceValues[0] === 5);
  if (is1or5) {
    console.log('Valid group: 1 or 5!');

    return {
      isValidGroups: true,
      groups: [
        {
          groupType: Constants.diceGroupTypes.oneOrFive,
          score: diceValues[0] === 1 ? 100 : 50,
          dice: { ...selectedDice },
        },
      ],
    };
  }

  const is3OfAKind =
    numberOfDice === 3 && diceValues.every((value) => value === diceValues[0]);
  if (is3OfAKind) {
    console.log('Valid group: 3 of a kind!');

    return {
      isValidGroups: true,
      groups: [
        {
          groupType: Constants.diceGroupTypes.threeOfAKind,
          score: diceValues[0] === 1 ? 1000 : diceValues[0] * 100,
          dice: { ...selectedDice },
        },
      ],
    };
  }

  // N.B. must check 6 of a kind before we check for 3 pairs, as 6 of a kind is a subset of 3 pairs
  const isSixOfAKind =
    numberOfDice === 6 && diceValues.every((value) => value === diceValues[0]);
  if (isSixOfAKind) {
    // 6 of a kind (=instant win!)
    console.log('Valid group: 6 of a kind!');

    return {
      isValidGroups: true,
      groups: [
        {
          groupType: Constants.diceGroupTypes.sixOfAKind,
          score: 10000, // NB special value as it's 'insta-win' (keep it a number so DB validation rules work)
          dice: { ...selectedDice },
        },
      ],
    };
  }

  const sorted = diceValues.sort();
  const is3Pairs =
    numberOfDice === 6 &&
    sorted[0] === sorted[1] &&
    sorted[2] === sorted[3] &&
    sorted[4] === sorted[5];
  // Exception to 3 pairs: [1 1 1 1 5 5] -> {1 1 1} {1} {5} {5} >  {1 1} {1 1} {5 5})
  const isException = sorted.join('') === '111155';
  if (is3Pairs && !isException) {
    // 3 pairs (=1000)
    console.log("That's a valid group: 3 pairs!");

    return {
      isValidGroups: true,
      groups: [
        {
          groupType: Constants.diceGroupTypes.threePairs,
          score: 1000,
          dice: { ...selectedDice },
        },
      ],
    };
  }

  const isRun =
    numberOfDice === 6 && areArraysEqual(sorted, [1, 2, 3, 4, 5, 6]);

  if (isRun) {
    // 1 2 3 4 5 6 (=1500)
    console.log("That's a valid group: a run!");

    return {
      isValidGroups: true,
      groups: [
        {
          groupType: Constants.diceGroupTypes.run,
          score: 1500,
          dice: { ...selectedDice },
        },
      ],
    };
  }

  // all 'pure' groups done (ie the user selected exlusively a single scoring group)

  // accept 'impure' selected groups (ie 2 or more scoring groups)
  const diceEntries = Object.entries(selectedDice); // list of [key, value] pairs (so we know which key relates to which value)
  const sortedDiceEntries = diceEntries.sort((a, b) => a[1] - b[1]);

  if (numberOfDice === 2) {
    const d0 = sortedDiceEntries[0];
    const d1 = sortedDiceEntries[1];

    const isTwo1s = d0[1] === 1 && d1[1] === 1;
    const is1And5 = d0[1] === 1 && d1[1] === 5;
    const isTwo5s = d0[1] === 5 && d1[1] === 5;
    if (isTwo1s || is1And5 || isTwo5s) {
      console.log(
        `${
          isTwo1s ? '(1,1)' : is1And5 ? '(1,5)' : '(5,5)'
        } is not a valid dice group, 
        but we'll bank them as 2 separate groups`,
      );
      return {
        isValidGroups: true,
        groups: [
          {
            groupType: Constants.diceGroupTypes.oneOrFive,
            score: d0[1] === 1 ? 100 : 50,
            dice: { [d0[0]]: d0[1] },
          },
          {
            groupType: Constants.diceGroupTypes.oneOrFive,
            score: d1[1] === 1 ? 100 : 50,
            dice: { [d1[0]]: d1[1] },
          },
        ],
      };
    }
  }

  if (numberOfDice === 3) {
    // 1 1 5, 1 5 5
    const d0 = sortedDiceEntries[0];
    const d1 = sortedDiceEntries[1];
    const d2 = sortedDiceEntries[2];

    const is115 = d0[1] === 1 && d1[1] === 1 && d2[1] === 5;
    const is155 = d0[1] === 1 && d1[1] === 5 && d2[1] === 5;

    if (is115 || is155) {
      console.log(
        `${
          is115 ? '1,1,5' : '1,5,5'
        } is not a valid dice group, but we'll bank them as 3 separate groups`,
      );
      return {
        isValidGroups: true,
        groups: [
          {
            groupType: Constants.diceGroupTypes.oneOrFive,
            score: d0[1] === 1 ? 100 : 50,
            dice: { [d0[0]]: [d0[1]] },
          },
          {
            groupType: Constants.diceGroupTypes.oneOrFive,
            score: d1[1] === 1 ? 100 : 50,
            dice: { [d1[0]]: d1[1] },
          },
          {
            groupType: Constants.diceGroupTypes.oneOrFive,
            score: d2[1] === 1 ? 100 : 50,
            dice: { [d2[0]]: d2[1] },
          },
        ],
      };
    }
  }

  const valuesString = sortedDiceEntries.map((entry) => entry[1]).join('');
  const idsString = sortedDiceEntries.map((entry) => entry[0]).join('');

  if (numberOfDice === 4) {
    // 3 of a kind + 1, 3 of a kind + 5, 1 1 5 5 (includes 4 1s and 4 5s)

    switch (valuesString) {
      case '1155': {
        const groups = [0, 1, 2, 3].map((i) => ({
          groupType: Constants.diceGroupTypes.oneOrFive,
          score: Number(valuesString[i]) === 1 ? 100 : 50,
          dice: { [idsString[i]]: valuesString[i] },
        }));
        return {
          isValidGroups: true,
          groups,
        };
      }

      case '1111':
      case '1222':
      case '1333':
      case '1444':
      case '1555':
      case '1666':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 100,
              dice: { [idsString[0]]: 1 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[1]) === 1
                  ? 1000
                  : Number(valuesString[1]) * 100,
              dice: {
                [idsString[1]]: Number(valuesString[1]),
                [idsString[2]]: Number(valuesString[1]),
                [idsString[3]]: Number(valuesString[1]),
              },
            },
          ],
        };
      case '1115':
      case '2225':
      case '3335':
      case '4445':
      case '5555':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[3]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[0]) === 1
                  ? 1000
                  : Number(valuesString[0]) * 100,
              dice: {
                [idsString[0]]: Number(valuesString[0]),
                [idsString[1]]: Number(valuesString[0]),
                [idsString[2]]: Number(valuesString[0]),
              },
            },
          ],
        };
      case '5666':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[0]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score: 600,
              dice: {
                [idsString[1]]: 6,
                [idsString[2]]: 6,
                [idsString[3]]: 6,
              },
            },
          ],
        };
      default:
        break;
    }
  }

  if (numberOfDice === 5) {
    // 3 of a kind + 11, 15 or 55
    switch (valuesString) {
      case '11111':
      case '11222':
      case '11333':
      case '11444':
      case '11555':
      case '11666':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 100,
              dice: { [idsString[0]]: 1 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 100,
              dice: { [idsString[1]]: 1 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[2]) === 1
                  ? 1000
                  : Number(valuesString[2]) * 100,
              dice: {
                [idsString[2]]: Number(valuesString[2]),
                [idsString[3]]: Number(valuesString[2]),
                [idsString[4]]: Number(valuesString[2]),
              },
            },
          ],
        };
      case '11115':
      case '12225':
      case '13335':
      case '14445':
      case '15555':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 100,
              dice: { [idsString[0]]: 1 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[4]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[1]) === 1
                  ? 1000
                  : Number(valuesString[1]) * 100,
              dice: {
                [idsString[1]]: Number(valuesString[1]),
                [idsString[2]]: Number(valuesString[1]),
                [idsString[3]]: Number(valuesString[1]),
              },
            },
          ],
        };
      case '15666':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 100,
              dice: { [idsString[0]]: 1 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[1]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[2]) === 1
                  ? 1000
                  : Number(valuesString[2]) * 100,
              dice: {
                [idsString[2]]: Number(valuesString[2]),
                [idsString[3]]: Number(valuesString[2]),
                [idsString[4]]: Number(valuesString[2]),
              },
            },
          ],
        };
      case '11155':
      case '22255':
      case '33355':
      case '44455':
      case '55555':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[3]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[4]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[0]) === 1
                  ? 1000
                  : Number(valuesString[0]) * 100,
              dice: {
                [idsString[0]]: Number(valuesString[0]),
                [idsString[1]]: Number(valuesString[0]),
                [idsString[2]]: Number(valuesString[0]),
              },
            },
          ],
        };
      case '55666':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[0]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[1]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[2]) === 1
                  ? 1000
                  : Number(valuesString[2]) * 100,
              dice: {
                [idsString[2]]: Number(valuesString[2]),
                [idsString[3]]: Number(valuesString[2]),
                [idsString[4]]: Number(valuesString[2]),
              },
            },
          ],
        };
      default:
        break;
    }
  }

  if (numberOfDice === 6) {
    switch (valuesString) {
      // 3 of a kind + 3 of a kind, minus 6 of the same and 3 pairs, as both are always higher
      // than other possibilities (except 1 1 1 1 5 5 - {1 1 1} {1} {5} {5} >  {1 1} {1 1} {5 5})
      case '111222':
      case '111333':
      case '111444':
      case '111555':
      case '111666':
      case '222333':
      case '222444':
      case '222555':
      case '222666':
      case '333444':
      case '333555':
      case '333666':
      case '444555':
      case '444666':
      case '555666':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[0]) === 1
                  ? 1000
                  : Number(valuesString[0]) * 100,
              dice: {
                [idsString[0]]: Number(valuesString[0]),
                [idsString[1]]: Number(valuesString[1]),
                [idsString[2]]: Number(valuesString[2]),
              },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[3]) === 1
                  ? 1000
                  : Number(valuesString[3]) * 100,
              dice: {
                [idsString[3]]: Number(valuesString[3]),
                [idsString[4]]: Number(valuesString[3]),
                [idsString[5]]: Number(valuesString[3]),
              },
            },
          ],
        };

      // 3 of a kind + 115 or 155
      // first group membership shape: 1 1 3 3 3 5
      case '111115':
      case '112225':
      case '113335':
      case '114445':
        // case '115555': 3 pairs
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 100,
              dice: { [idsString[0]]: 1 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 100,
              dice: { [idsString[1]]: 1 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[5]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[2]) === 1
                  ? 1000
                  : Number(valuesString[2]) * 100,
              dice: {
                [idsString[2]]: Number(valuesString[2]),
                [idsString[3]]: Number(valuesString[2]),
                [idsString[4]]: Number(valuesString[2]),
              },
            },
          ],
        };

      // group membership shape: 1 3 3 3 5 5
      case '111155': // 3 pairs exception - doing it as multiple groups makes a higher score
      case '122255':
      case '133355':
      case '144455':
      case '155555':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 100,
              dice: { [idsString[0]]: 1 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[4]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[5]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[1]) === 1
                  ? 1000
                  : Number(valuesString[1]) * 100,
              dice: {
                [idsString[1]]: Number(valuesString[1]),
                [idsString[2]]: Number(valuesString[1]),
                [idsString[3]]: Number(valuesString[1]),
              },
            },
          ],
        };
      // group membership shape: 1 1/5 5 3 3 3
      case '115666':
      case '155666':
        return {
          isValidGroups: true,
          groups: [
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 100,
              dice: { [idsString[0]]: 1 },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: Number(valuesString[1]) === 1 ? 100 : 50,
              dice: { [idsString[1]]: valuesString[1] },
            },
            {
              groupType: Constants.diceGroupTypes.oneOrFive,
              score: 50,
              dice: { [idsString[2]]: 5 },
            },
            {
              groupType: Constants.diceGroupTypes.threeOfAKind,
              score:
                Number(valuesString[3]) === 1
                  ? 1000
                  : Number(valuesString[3]) * 100,
              dice: {
                [idsString[3]]: Number(valuesString[3]),
                [idsString[4]]: Number(valuesString[3]),
                [idsString[5]]: Number(valuesString[3]),
              },
            },
          ],
        };
      default:
        break;
    }
  }

  return {
    isValidGroups: false,
    invalidReason: "That's not a valid set of dice",
  };
};

/*

  Returns the set of scoring groups, plus any remaining dice (that aren't in the scoring groups)
*/
const getHighestScoringGrouping = (bankedDice) => {
  const groups = [];
  // let remainingDice = { ...bankedDice };
  // 1. make tally map
  let tally = {};
  Object.entries(bankedDice).forEach(([diceId, value]) => {
    if (!tally[value]) {
      tally[value] = [];
    }
    tally[value] = [...tally[value], diceId];
  });

  // 2. check for 6-sized scoring groups
  //
  // i) 6 of a kind
  //    Only one entry in `tally`, the array has 6 diceIds in it.
  const isSixOfAKind = Object.values(tally)[0].length === 6;
  if (isSixOfAKind) {
    groups.push({
      groupType: Constants.diceGroupTypes.sixOfAKind,
      score: 10000, // NB special value as it's 'insta-win' (keep it a number so DB validation rules work)
      dice: { ...bankedDice },
    });
    tally = {};
  }

  // ii) run of 6 dice
  //     `tally` has 6 entries (pigeonhole principle - must be a run of 1 to 6)
  const isRun = Object.keys(tally).length === 6;
  if (isRun) {
    groups.push({
      groupType: Constants.diceGroupTypes.run,
      score: 1500,
      dice: { ...bankedDice },
    });
    tally = {};
  }

  // iii) 3 pairs
  //      3 sets of 2 , or a set of 2 and a set of 4 => all tallies divisible by 2!
  //      Exception - if there are 4 1's and another pair, then taking the 4 1's as 1100 is better.
  const is3Pairs =
    Object.values(tally).length > 0 &&
    Object.values(tally).every((tallyList) => tallyList.length % 2 === 0) &&
    (!tally[1] || tally[1].length !== 4);
  if (is3Pairs) {
    groups.push({
      groupType: Constants.diceGroupTypes.threePairs,
      score: 1000,
      dice: { ...bankedDice },
    });
    tally = {};
  }

  // 3. 3 of a kind
  //    Any tally entries containing 3 *or more* diceIds.
  //    Can have 2 sets of 3 of a kind, e.g. 333666
  //    Can't have 2 sets of 3, all of the same value (e.g. 222222), as this would have been
  //    consumed already as 6 of a kind.
  //    Can be more than 3 entries e.g. 222223 => 222 scoring dice, with 223 left.
  const entriesWith3dice = Object.entries(tally).filter(
    ([value, tallyList]) => tallyList.length >= 3,
  );
  const has3OfAKind = entriesWith3dice.length > 0;
  if (has3OfAKind) {
    // iterate over the entries with 3 dice, because there could be one or two
    entriesWith3dice.forEach(([value, tallyList]) => {
      const v = Number(value);
      const score = v === 1 ? 1000 : v * 100;
      const dice = {
        [tallyList[0]]: v,
        [tallyList[1]]: v,
        [tallyList[2]]: v,
      };
      groups.push({
        groupType: Constants.diceGroupTypes.threeOfAKind,
        score,
        dice,
      });
      if (tallyList.length === 3) {
        delete tally[value];
      } else {
        // there are more than 3 dice with this value - need to keep the entry, just remove the
        // first 3 diceIds
        tally[value] = tallyList.slice(3);
      }
    });
  }

  // 3. 1 or 5
  //    Do the remaining entries for 1 or 5 contain 1 or 2 diceIds?
  const has1s = tally[1] && tally[1].length > 0;
  const has5s = tally[5] && tally[5].length > 0;
  if (has1s) {
    tally[1].forEach((diceId) => {
      groups.push({
        groupType: Constants.diceGroupTypes.oneOrFive,
        score: 100,
        dice: { [diceId]: 1 },
      });
    });
    delete tally[1];
  }
  if (has5s) {
    tally[5].forEach((diceId) => {
      groups.push({
        groupType: Constants.diceGroupTypes.oneOrFive,
        score: 50,
        dice: { [diceId]: 5 },
      });
    });
    delete tally[5];
  }

  // see what's left in the tally
  const remainingDice = {};
  Object.entries(tally).forEach(([value, diceIdList]) => {
    if (diceIdList && Array.isArray(diceIdList)) {
      diceIdList.forEach((diceId) => {
        remainingDice[diceId] = Number(value);
      });
    }
  });

  return {
    groups,
    remainingDice,
  };
};

export default {
  getValidScoringGroups,
  getHighestScoringGrouping,
};
