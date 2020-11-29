import Constants from './constants';

/*
  Returns the set of scoring groups, plus any remaining dice (that aren't in the scoring groups)
  # Parameters
    - bankedDice: { [diceId]: value }
*/
const getHighestScoringGrouping = (bankedDice) => {
  if (!bankedDice || Object.keys(bankedDice).length === 0) {
    return {
      groups: [],
      remainingDice: {},
    };
  }
  const groups = [];
  
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
  //      3 sets of 2, or a set of 2 and a set of 4 => all tallies divisible by 2!
  //      Exception - if there are 4 1's and another pair, then taking the 4 1's as 1100 is better.
  //      N.B. need to check 6 dice are banked in total, as e.g. 1122 would satisfy "every tallyList's length
  //      is divisible by 2".
  const is6DiceInTotal =
    tally &&
    Object.values(tally).length > 0 &&
    Object.values(tally)
      .filter((tallyList) => tallyList && tallyList.length > 0)
      .reduce((accum, tallyList) => accum + tallyList.length, 0) === 6;
  const is3Pairs =
    is6DiceInTotal &&
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
  getHighestScoringGrouping,
};
