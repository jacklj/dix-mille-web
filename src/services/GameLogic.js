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

  if (numberOfDice === 4) {
    // 3 of a kind + 1, 3 of a kind + 5, 1 1 5 5 (includes 4 1s and 4 5s)
    const valuesToKeys = {}; // { 1: ['c'], 3: ['b', 'd', 'e'], 5: ['a']}
    Object.keys(selectedDice).forEach((key) => {
      const value = selectedDice[key];
      if (!valuesToKeys[value]) {
        valuesToKeys[value] = [];
      }
      valuesToKeys[value].push(key);
    });

    // 4 1s or 4 5s
    if (
      Object.values(valuesToKeys)[0].length === 4 &&
      (Object.keys(valuesToKeys)[0] === 1 || Object.keys(valuesToKeys)[0] === 5)
    ) {
      const is1s = Object.keys(valuesToKeys)[0] === 1;
      const lastDiceId = Object.keys(selectedDice)[3];
      const threeOfAKindDice = delete { ...selectedDice }[lastDiceId];
      return {
        isValidGroups: true,
        groups: [
          {
            groupType: Constants.diceGroupTypes.threeOfAKind,
            score: is1s ? 1000 : 500,
            dice: threeOfAKindDice,
          },
          {
            groupType: Constants.diceGroupTypes.oneOrFive,
            score: is1s ? 100 : 50,
            dice: { [lastDiceId]: is1s ? 1 : 5 },
          },
        ],
      };
    }

    // 4 1s or 4 5s
    if (
      Object.values(valuesToKeys).some(keys => keys.length === 3) &&
      (Object.keys(valuesToKeys)[0] === 1 || Object.keys(valuesToKeys)[0] === 5)
    ) {
  }

  // if (numberOfDice === 5) {
  //   // 3 of a kind + 1 1, 3 of a kind + 1 5, 3 of a kind + 5 5,
  // }

  const sortedDiceEntries = diceEntries.sort((a, b) => a[1] - b[1]); // sorted by value
  const valuesString = sortedDiceEntries.map(entry => entry[1]).join('');
  const idsString = sortedDiceEntries.map(entry => entry[0]).join('');


  // else its 3 of a kind
  switch(valuesString) {
    case '1155': {
      const groups = [0,1,2,3].map(i => ({
        groupType: Constants.diceGroupTypes.oneOrFive,
        score: valuesString[i] == 1 ? 100 : 50,
        dice: { [idsString[i]]: valuesString[i] },
      }))
      return {
        isValidGroups: true,
        groups,
      }
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
            score: Number(valuesString[1]) === 1 ? 1000 : Number(valuesString[1]) * 100,
            dice: {
              [idsString[1]]: Number(valuesString[1]),
              [idsString[2]]: Number(valuesString[1]),
              [idsString[3]]: Number(valuesString[1]),
            },
          },
          
        ]
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
            score: Number(valuesString[0]) === 1 ? 1000 : Number(valuesString[0]) * 100,
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



  return {
    isValidGroups: false,
    invalidReason: "That's not a valid set of dice",
  };
};

export default {
  getValidScoringGroups,
};
