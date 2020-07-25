// import moment from 'moment';
import { selectAllAvatars } from 'redux/avatars/selectors';
import { selectUid } from 'redux/auth/selectors';

export const selectGameCode = (state) => state.game.gameCode;

export const selectGameId = (state) => state.game.gameId;

export const selectGameStartedAt = (state) => state.game.startedAt;

export const selectPlayer = (uid) => (state) => state.game.players[uid];

const selectPlayers = (state) => state.game.players;

const selectNumberOfPlayers = (state) => {
  const players = selectPlayers(state);
  return Object.keys(players).length;
};

export const selectAllUserIdsWithFilledOutProfiles = (state) => {
  const allUsers = { ...selectPlayers(state) };

  const uids = Object.keys(allUsers)
    .map((uid) => {
      const value = allUsers[uid];
      return {
        ...value,
        uid,
      };
    })
    .filter((user) => user.name) // if they havent filled out their profile yet, dont display them in Waiting Room
    .sort((a, b) => {
      // order by datetime joined
      if (a.joinedAt < b.joinedAt) {
        return -1;
      } else if (b.joinedAt < a.joinedAt) {
        return 1;
      } else {
        return 0;
      }
    })
    .map((userObj) => userObj.uid);

  return uids;
};

export const selectAllUsedNames = (state) => {
  const allPlayers = selectPlayers(state);
  if (!allPlayers) {
    return undefined;
  }

  const names = Object.values(allPlayers).map((player) => player.name);

  return names;
};

export const selectAvatarUrl = (avatarId) => (state) => {
  const avatars = selectAllAvatars(state);

  if (typeof avatarId !== 'number' || !avatars) {
    return undefined;
  }

  return avatars[avatarId];
};

export const selectMyAvatarUrl = (state) => {
  const avatarId = state.auth.avatarId;

  const myAvatarUrl = selectAvatarUrl(avatarId)(state);

  return myAvatarUrl;
};

export const selectAllAvatarsWithChosenStatus = (state) => {
  const allAvatars = selectAllAvatars(state);

  const allPlayers = selectPlayers(state);

  if (!allAvatars || allAvatars.length === 0 || !allPlayers) {
    return undefined;
  }

  const alreadyUsedAvatars = {};

  Object.values(allPlayers).forEach((player) => {
    const { avatarId } = player;
    if (avatarId || typeof avatarId === 'number') {
      // avatarId is a number, this works for strings too, in case we have string ids in future
      alreadyUsedAvatars[avatarId] = true;
    }
  });

  return allAvatars.map((url, key) => ({
    url,
    alreadyChosen: !!alreadyUsedAvatars[key],
  }));
};

// game play
export const selectCurrentTurn = (state) => state.game.currentTurn;

export const selectCurrentRound = (state) => state.game.currentRound;

export const selectPlayerTurnOrder = (state) => state.game.playerTurnOrder;

export const selectCurrentTurnPlayerUid = (state) => {
  const { currentTurn } = state.game;
  const playerTurnOrder = selectPlayerTurnOrder(state);

  if (!playerTurnOrder || typeof currentTurn !== 'number') {
    return undefined;
  }

  return playerTurnOrder[currentTurn];
};

export const isItMyTurn = (state) => {
  const playerWhosTurnItIsUid = selectCurrentTurnPlayerUid(state);

  const myUid = selectUid(state);

  return myUid === playerWhosTurnItIsUid;
};

const selectCurrentRollObj = (state) => {
  const {
    currentRound: currentRoundId,
    currentTurn: currentTurnId,
    rounds,
  } = state.game;

  const currentRoundObj = rounds[currentRoundId];

  if (!currentRoundObj || !currentRoundObj.turns) {
    return undefined;
  }

  const currentTurnObj = currentRoundObj.turns[currentTurnId];

  if (!currentTurnObj) {
    return undefined;
  }

  const { rolls } = currentTurnObj;

  if (!rolls || !Array.isArray(rolls)) {
    return undefined;
  }

  const currentRoll = rolls[rolls.length - 1];

  return currentRoll;
};

export const selectCurrentRollNumber = (state) => {
  const {
    currentRound: currentRoundId,
    currentTurn: currentTurnId,
    rounds,
  } = state.game;

  const currentRoundObj = rounds[currentRoundId];

  if (!currentRoundObj || !currentRoundObj.turns) {
    return undefined;
  }

  const currentTurnObj = currentRoundObj.turns[currentTurnId];

  if (!currentTurnObj) {
    return undefined;
  }

  const { rolls } = currentTurnObj;

  if (!rolls || !Array.isArray(rolls)) {
    return undefined;
  }

  return rolls.length - 1;
};

export const selectTwoThrowsToDoubleIt = (state) => {
  const currentRoll = selectCurrentRollObj(state);

  return currentRoll?.twoThrowsToDoubleIt;
};

export const selectCurrentRoll = (state) => {
  const currentRoll = selectCurrentRollObj(state);

  return currentRoll?.roll;
};

export const selectCurrentScoringGroups = (state) => {
  const currentRoll = selectCurrentRollObj(state);

  return currentRoll?.scoringGroups;
};

export const selectPreviousScoringGroupsSinceLastFullRoll = (state) => {
  const {
    currentRound: currentRoundId,
    currentTurn: currentTurnId,
    rounds,
  } = state.game;

  const currentTurn = rounds?.[currentRoundId]?.turns?.[currentTurnId];

  if (!currentTurn) {
    return undefined;
  }

  const { rolls } = currentTurn;

  if (!rolls || !Array.isArray(rolls)) {
    // if no rolls yet, no scoring groups
    return undefined;
  }

  // if  first roll, no previous scoring groups
  if (rolls.length <= 1) {
    return undefined;
  }

  // if current roll is a full roll, dont display any previous scoring groups
  const currentRoll = rolls[rolls.length - 1];
  const { roll } = currentRoll;
  const isSixDiceRoll = Object.keys(roll).length === 6;
  if (isSixDiceRoll) {
    return undefined;
  }

  const penultimateRollIndex = rolls.length - 2;

  // look back from current roll to find last full roll, and get all the scoring groups
  // in between (inclusive)
  // NB add rollId to the scoring group
  // NB order: most recent first
  const allScoringGroups = [];

  for (let i = penultimateRollIndex; i >= 0; i--) {
    const rollObj = rolls[i];
    const { roll, scoringGroups, twoThrowsToDoubleIt } = rollObj;

    if (!scoringGroups) {
      if (twoThrowsToDoubleIt) {
        // fine
        continue;
      } else {
        throw new Error(
          "A previous roll has no banked scoring groups, and is not a 'two throws to double it' roll - inconsistent.",
        );
      }
    }
    Object.keys(scoringGroups).forEach((groupId) => {
      const scoringGroup = scoringGroups[groupId];
      allScoringGroups.push({ rollIndex: i, groupId, ...scoringGroup });
    });

    if (Object.keys(roll).length === 6) {
      // we've hit a full roll - stop looking.
      break;
    }
  }

  return allScoringGroups;
};

export const selectTurnScoreSoFar = (state) => {
  const {
    currentRound: currentRoundId,
    currentTurn: currentTurnId,
    rounds,
  } = state.game;

  const currentTurn = rounds?.[currentRoundId]?.turns?.[currentTurnId];

  if (!currentTurn) {
    return undefined;
  }

  const { rolls } = currentTurn;

  if (!rolls || !Array.isArray(rolls)) {
    // if no rolls yet, no scoring groups
    return undefined;
  }

  if (
    currentTurn.didBlap ||
    currentTurn.rolls[currentTurn.rolls.length - 1].isBlapped
  ) {
    return 0;
  }

  const turnScore = rolls.reduce((accumulator, rollObj) => {
    const { scoringGroups, twoThrowsToDoubleIt } = rollObj;

    // this ensures even when you have the 1st roll of 2 throws to double it not being
    //  a 1 or 5? This should crash?
    if (!scoringGroups || Object.keys(scoringGroups).length === 0) {
      return accumulator;
    }

    const rollScore = Object.values(scoringGroups).reduce(
      (acc, scoringGroup) => {
        const { score } = scoringGroup;
        return acc + score;
      },
      0,
    );

    const rollWasASuccessful2ThrowsToDoubleIt =
      twoThrowsToDoubleIt && scoringGroups.length === 1;
    if (rollWasASuccessful2ThrowsToDoubleIt) {
      return 2 * (accumulator + rollScore);
    }
    return accumulator + rollScore;
  }, 0);

  return turnScore;
};

export const selectCurrentRollMinusScoringGroups = (state) => {
  const currentDiceRoll = selectCurrentRoll(state);

  const scoringGroups = selectCurrentScoringGroups(state);

  if (!scoringGroups) {
    return currentDiceRoll;
  }

  const result = { ...currentDiceRoll };

  Object.values(scoringGroups).forEach((groupObj) => {
    const { dice } = groupObj;
    Object.keys(dice).forEach((dieId) => {
      delete result[dieId];
    });
  });

  return result;
};

export const selectIsBlapped = (state) => {
  const currentRoll = selectCurrentRollObj(state);

  if (!currentRoll) {
    return undefined;
  }

  const { isBlapped } = currentRoll;

  return isBlapped;
};

export const selectHasSomeoneWon = (state) => {
  const { winner: winnerUid } = state.game;

  if (!winnerUid) {
    return false;
  } else {
    const myUid = selectUid(state);
    const didIWin = myUid === winnerUid;

    const allPlayers = selectPlayers(state);
    const winnersName = allPlayers[winnerUid].name;

    return {
      didIWin,
      winnersName,
    };
  }
};

// scores table
export const selectPlayerNamesInTurnOrder = (state) => {
  const turnOrder = selectPlayerTurnOrder(state);

  const allPlayers = selectPlayers(state);

  if (!turnOrder || !allPlayers) {
    return undefined;
  }

  return turnOrder.map((uid) => allPlayers[uid].name);
};

// const turnScores = {
// [roundIndex]: {
//  [turnIndex]: 600,
//  ...
// },
// ...
// }

export const selectAllTurnScores = (state) => {
  // get number of players, so we can set up the table to have the right number of cells
  const numberOfPlayers = selectNumberOfPlayers(state);

  // get each turn score and add to scores map
  const { rounds } = state.game;
  const scoresMatrix = rounds.map((round, roundIndex) => {
    const { turns } = round;
    const row = new Array(numberOfPlayers).fill('');
    turns.forEach((turn, turnIndex) => {
      row[turnIndex] = turn.turnScore;
    });

    return row;
  });

  // TODO current turn may be undefined...
  return scoresMatrix;
};

export const selectTotalScores = (state) => {
  const allPlayers = selectPlayers(state);

  const turnOrder = selectPlayerTurnOrder(state);

  if (!turnOrder || !allPlayers) {
    return undefined;
  }

  return turnOrder.map((uid) => allPlayers[uid]?.currentScore);
};
