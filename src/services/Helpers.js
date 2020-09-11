const filterBankedDice = (dice) => {
  const bankedDice = {};

  Object.entries(dice)
    .filter(([diceId, { isBanked }]) => isBanked)
    .forEach(([diceId, details]) => {
      bankedDice[diceId] = details;
    });

  return bankedDice;
};

const transformDiceDetailsIntoValueMap = (diceDetailsMap) => {
  const values = {};

  Object.entries(diceDetailsMap).forEach(([diceId, { value }]) => {
    values[diceId] = value;
  });

  return values;
};

export default {
  filterBankedDice,
  transformDiceDetailsIntoValueMap,
};
