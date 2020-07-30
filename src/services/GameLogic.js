import Constants from './constants';

const areArraysEqual = (a, b) => a.every((value, index) => value === b[index]);

const getValidScoringGroups = (selectedDice) => {
  // selectedDice is a map of dice, e.g. { b: 5, c: 5, e: 5 }
  const numberOfDice = Object.keys(selectedDice).length;
  const diceValues = Object.values(selectedDice);

  let isValidGroup;
  let invalidReason;
  let groupType;
  let score;
  let scoringGroupDice;

  if (numberOfDice === 1) {
    if (diceValues[0] === 1 || diceValues[0] === 5) {
      console.log("That's a valid group: 1 or 5!");

      isValidGroup = true;
      groupType = Constants.diceGroupTypes.oneOrFive;
      score = diceValues[0] === 1 ? 100 : 50;
      scoringGroupDice = { ...selectedDice };
    } else {
      invalidReason = "That's not a valid set of dice";
      isValidGroup = false;
    }
  } else if (numberOfDice === 3) {
    // 3 of a kind?
    const allTheSame = diceValues.every((value) => value === diceValues[0]);
    if (allTheSame) {
      console.log("That's a valid group: 3 of a kind!");

      isValidGroup = true;
      groupType = Constants.diceGroupTypes.threeOfAKind;
      score = diceValues[0] === 1 ? 1000 : diceValues[0] * 100;
      scoringGroupDice = { ...selectedDice };
    } else {
      invalidReason = "That's not a valid set of dice";
      isValidGroup = false;
    }
  } else if (numberOfDice === 6) {
    const sixOfAKind = diceValues.every((value) => value === diceValues[0]);
    const sorted = diceValues.sort();
    const threePairs =
      sorted[0] === sorted[1] &&
      sorted[2] === sorted[3] &&
      sorted[4] === sorted[5];
    const run = areArraysEqual(sorted, [1, 2, 3, 4, 5, 6]);

    if (sixOfAKind) {
      // 6 of a kind (=instant win!)
      // N.B. must check this before we check for 3 pairs, as 6 of a kind is a subset of 3 pairs
      console.log("That's a valid group: 6 of a kind!");

      isValidGroup = true;
      groupType = Constants.diceGroupTypes.sixOfAKind;
      score = 10000; // TODO it's actually an instant win, not just 10,000 score - sort this.
      scoringGroupDice = { ...selectedDice };
    } else if (threePairs) {
      // 3 pairs (=1000)
      console.log("That's a valid group: 3 pairs!");

      isValidGroup = true;
      groupType = Constants.diceGroupTypes.threePairs;
      score = 1000;
      scoringGroupDice = { ...selectedDice };
    } else if (run) {
      // 1 2 3 4 5 6 (=1500)
      console.log("That's a valid group: a run!");

      isValidGroup = true;
      groupType = Constants.diceGroupTypes.run;
      score = 1500;
      scoringGroupDice = { ...selectedDice };
    } else {
      invalidReason = "That's not a valid set of dice";
      isValidGroup = false;
    }
  } else {
    // give more detail if they've tried to bank 2 dice
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
    isValidGroup = false;
  }

  return {
    isValidGroup,
    invalidReason,
    groupType,
    score,
    scoringGroupDice,
  };
};

export default {
  getValidScoringGroups,
};
