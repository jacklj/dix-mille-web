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
          score: 10000, // TODO it's actually an instant win, not just 10,000 score - sort this.
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
  if (is3Pairs) {
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
      group: [
        {
          groupType: Constants.diceGroupTypes.run,
          score: 1500,
          dice: { ...selectedDice },
        },
      ],
    };
  }

  // all 'pure' groups done (ie the user selected exlusively a single scoring group)

  // TODO deal with 'impure' groups

  // error messages
  let invalidReason;
  if (diceValues.length === 2) {
    if (diceValues[0] === 1 && diceValues[1] === 1) {
      invalidReason =
        "Two 1s is not a valid dice group - try banking each '1' individually";
    } else if (diceValues[0] === 5 && diceValues[1] === 5) {
      invalidReason =
        "Two 5s is not a valid dice group - try banking each '5' individually";
    } else if (diceValues[0] === diceValues[1]) {
      invalidReason = 'Two of a kind is not a valid dice group.';
    } else {
      invalidReason = "That's not a valid set of dice";
    }
  } else {
    invalidReason = "That's not a valid set of dice";
  }

  return {
    isValidGroups: false,
    invalidReason,
  };
};

export default {
  getValidScoringGroups,
};
