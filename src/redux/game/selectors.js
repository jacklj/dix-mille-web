// import moment from 'moment';
import { selectAllAvatars } from 'redux/avatars/selectors';
import { selectUid } from 'redux/auth/selectors';

export const selectGameCode = (state) => state.game.gameCode;

export const selectGameId = (state) => state.game.gameId;

export const selectGameStartedAt = (state) => state.game.startedAt;

export const selectPlayer = (uid) => (state) => state.game.players[uid];

const selectPlayers = (state) => state.game.players;

export const selectOtherUsersWithFilledOutProfiles = (state) => {
  const myUid = state.auth.uid;
  const allPlayers = { ...selectPlayers(state) };

  delete allPlayers[myUid];

  const otherUsersUids = Object.keys(allPlayers)
    .map((uid) => {
      const value = allPlayers[uid];
      return {
        ...value,
        uid,
      };
    })
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
    .filter((player) => player.name) // if they havent filled out their profile yet, dont display them in Waiting Room
    .map((playerObj) => playerObj.uid);

  return otherUsersUids;
};

export const selectUidToNameMap = (state) => {
  const allPlayers = selectPlayers(state);

  if (!allPlayers) {
    return undefined;
  }

  const uidToNameMap = {};

  Object.keys(allPlayers).forEach((uid) => {
    uidToNameMap[uid] = allPlayers[uid].name;
  });

  return uidToNameMap;
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

export const selectCurrentDiceRoll = (state) => {
  const currentRoll = selectCurrentRollObj(state);

  if (!currentRoll) {
    return undefined;
  }

  const { roll } = currentRoll;

  return roll;
};

export const selectScoringGroups = (state) => {
  const currentRoll = selectCurrentRollObj(state);

  return currentRoll?.scoringGroups;
};

export const selectCurrentDiceRollMinusScoringGroups = (state) => {
  const currentDiceRoll = selectCurrentDiceRoll(state);

  const scoringGroups = selectScoringGroups(state);

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
