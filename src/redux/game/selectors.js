import { selectAllAvatars } from 'redux/avatars/selectors';
import { selectUid } from 'redux/auth/selectors';
import {
  selectIsShakingCupLocal,
  selectIsRollDiceCloudFunctionRunning,
} from 'redux/ui/selectors';
import Constants from 'services/constants';
import Helpers from 'services/Helpers';

export const selectGameCode = (state) => state.game.gameCode;

export const selectIsSinglePlayerGame = (state) =>
  state.game.gameType === 'singlePlayer';

export const selectGameId = (state) => state.game.gameId;

export const selectGameStartedAt = (state) => state.game.startedAt;

export const selectHasGameStarted = (state) => !!state.game.startedAt;

export const selectPlayer = (uid) => (state) => state.game.players?.[uid];

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
  const myUid = selectUid(state);

  if (!allAvatars || allAvatars.length === 0 || !allPlayers) {
    return undefined;
  }

  const alreadyUsedAvatars = {};

  Object.keys(allPlayers).forEach((uid) => {
    const player = allPlayers[uid];

    const { avatarId } = player;
    if (avatarId || typeof avatarId === 'number') {
      // If it's me that's chosen the avatar, don't display it as already used. This is to fix
      // the UI 'bug' where I've just chosen an avatar, but the page hasn't navigated from
      // PlayerSetup to WaitingRoom - then I see the avatar that I just chose being greyed out,
      // which is confusing. So don't grey it out if it's my chosen avatar.
      if (uid === myUid) {
        return; // skip this iteration.
      }

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
export const selectCurrentTurnId = (state) => state.game.currentTurn;

export const selectCurrentRoundId = (state) => state.game.currentRound;

export const selectPlayerTurnOrder = (state) => state.game.playerTurnOrder;

export const selectCurrentTurnPlayerUid = (state) => {
  const { currentTurn } = state.game;
  const playerTurnOrder = selectPlayerTurnOrder(state);

  if (!playerTurnOrder || typeof currentTurn !== 'number') {
    return undefined;
  }

  return playerTurnOrder[currentTurn];
};

export const selectCurrentTurnPlayerName = (state) => {
  const uid = selectCurrentTurnPlayerUid(state);

  const player = selectPlayer(uid)(state);

  return player?.name;
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

  const currentRoundObj = rounds?.[currentRoundId];

  const currentTurnObj = currentRoundObj?.turns?.[currentTurnId];

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

  const currentRoundObj = rounds?.[currentRoundId];

  if (!currentRoundObj || !currentRoundObj.turns) {
    return undefined;
  }

  const currentTurnObj = currentRoundObj?.turns?.[currentTurnId];

  if (!currentTurnObj) {
    return undefined;
  }

  const { rolls } = currentTurnObj;

  if (!rolls || !Array.isArray(rolls)) {
    return undefined;
  }

  return rolls.length - 1;
};

export const selectIsFirstOfTwoThrowsToDoubleIt = (state) => {
  const currentRoll = selectCurrentRollObj(state);

  return (
    currentRoll?.rollType === Constants.ROLL_TYPES.TWO_THROWS_TO_DOUBLE_IT.FIRST
  );
};

export const selectIsFailedFirstOfTwoThrowsToDoubleIt = (state) => {
  const currentRoll = selectCurrentRollObj(state);
  const isRolling = selectIsRolling(state);

  if (
    currentRoll?.rollType !== Constants.ROLL_TYPES.TWO_THROWS_TO_DOUBLE_IT.FIRST
  ) {
    return false;
  }

  const { roll } = currentRoll;

  if (!roll || Object.values(roll).length !== 1) {
    return false;
  }

  const rolledValue = Object.values(roll)[0];

  if (rolledValue === 1 || rolledValue === 5 || isRolling) {
    return false;
  }

  return true;
};

export const selectIsSuccessfulTwoThrowsToDoubleIt = (state) => {
  const currentRoll = selectCurrentRollObj(state);
  const isRolling = selectIsRolling(state);

  if (
    currentRoll?.rollType !==
      Constants.ROLL_TYPES.TWO_THROWS_TO_DOUBLE_IT.FIRST &&
    currentRoll?.rollType !==
      Constants.ROLL_TYPES.TWO_THROWS_TO_DOUBLE_IT.SECOND
  ) {
    return false;
  }

  const { roll } = currentRoll;

  if (!roll || Object.values(roll).length !== 1) {
    return false;
  }

  const rolledValue = Object.values(roll)[0];

  if ((rolledValue === 1 || rolledValue === 5) && !isRolling) {
    return true;
  }

  return false;
};

export const selectCurrentRoll = (state) => {
  const currentRoll = selectCurrentRollObj(state);

  return currentRoll?.roll;
};

export const selectAllCurrentDiceWithDetails = (state) => {
  const currentRollObj = selectCurrentRollObj(state);

  if (!currentRollObj) {
    return undefined;
  }

  const {
    roll,
    bankedDice,
    diceToScoringGroups,
    dicePositions,
  } = currentRollObj;

  if (!roll || Object.keys(roll) === 0) {
    return undefined;
  }

  const dice = {};

  Object.entries(roll).forEach(([diceId, value]) => {
    const isBanked = bankedDice?.[diceId];
    const scoringGroupId = diceToScoringGroups?.[diceId];
    const position = dicePositions?.[diceId];

    dice[diceId] = {
      value,
      isBanked,
      scoringGroupId,
      position,
    };
  });

  return dice;
};

export const selectBankedDice = (state) => {
  const dice = selectAllCurrentDiceWithDetails(state);
  if (!dice || Object.keys(dice).length === 0) {
    return;
  }

  const bankedDice = Helpers.filterBankedDice(dice);
  return bankedDice;
};

export const selectAreAnyBankedDiceInvalid = (state) => {
  const bankedDice = selectBankedDice(state);
  return (
    bankedDice &&
    Object.entries(bankedDice).some(
      ([diceId, { scoringGroupId }]) => !scoringGroupId,
    )
  );
};

// alternate sorting methods
// const sortByGroupScores = (a, b) => {
//   if ((a.score && !b.score) || a.score > b.score) {
//     return -1;
//   } else if ((!a.score && b.score) || a.score < b.score) {
//     return 1;
//   } else {
//     // perhaps sort by scoring group id
//     return 0;
//   }
// };

const sortByScoringOrNotThenDiceValues = (a, b) => {
  if (a.scoringGroupId && !b.scoringGroupId) {
    return -1;
  } else if (!a.scoringGroupId && b.scoringGroupId) {
    return 1;
  } else {
    // both non scoring or both scoring - sort by dice value
    return Number(a.value) - Number(b.value);
  }
};

// this could be a good candidate for memoisation
export const selectBankedDiceOrder = (state) => {
  const bankedDice = selectBankedDice(state);

  if (!bankedDice || Object.keys(bankedDice).length === 0) {
    return;
  }

  const bankedDiceOrder = Object.entries(bankedDice)
    .map(([diceId, details]) => {
      // N.B. the banked dice may not be in a scoring group
      return {
        diceId,
        ...details,
        // N.B. details doesn't include the `score` as we're not using that sorting
        // function for now - will have to put it back if we do in future
      };
    })
    // order by groupScores or by dice values
    .sort(sortByScoringOrNotThenDiceValues)
    .map((diceDetailsObj) => diceDetailsObj.diceId);

  return bankedDiceOrder;
};

export const selectCurrentScoringGroups = (state) => {
  const currentRoll = selectCurrentRollObj(state);

  return currentRoll?.scoringGroups;
};

// Gets list of previous scoring groups (since last full roll, so that there
// are only ever 6 dice on screen)
export const selectPreviousScoringGroups = (state) => {
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

  // if current roll is a full roll, don't display any previous scoring groups
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
  const bankedDiceOfPreviousRolls = [];

  for (let i = penultimateRollIndex; i >= 0; i--) {
    const rollObj = rolls[i];
    const { roll, scoringGroups, rollType } = rollObj;

    if (!scoringGroups) {
      if (
        rollType === Constants.ROLL_TYPES.TWO_THROWS_TO_DOUBLE_IT.FIRST ||
        rollType === Constants.ROLL_TYPES.TWO_THROWS_TO_DOUBLE_IT.SECOND
      ) {
        // fine
        continue;
      } else {
        throw new Error(
          "A previous roll has no banked scoring groups, and is not a 'two throws to double it' roll - inconsistent.",
        );
      }
    }
    // TODO here, instead of just getting scoring groups and pushing them onto 'bankedDiceOfPreviousRolls', use the same
    // alg as in the current banked dice selector to sort the dice.
    // N.B. all banked dice in a previous roll will be scoring dice, as you can't roll again if
    // any non-grouped dice are banked. So we can just get the banked dice and put them in order of value,

    // i. filter `roll` - only keep banked dice
    const { bankedDice } = rollObj;
    const bankedDiceWithValues = {};
    Object.entries(roll)
      .filter(([diceId, value]) => bankedDice[diceId])
      .forEach(([diceId, value]) => {
        bankedDiceWithValues[diceId] = value;
      });

    const bankedDiceOrder = Object.entries(bankedDiceWithValues)
      .sort((a, b) => Number(a[1]) - Number(b[1]))
      .map(([diceId, value]) => diceId);

    bankedDiceOfPreviousRolls.push({
      rollIndex: i,
      dice: bankedDiceWithValues,
      order: bankedDiceOrder,
    });

    if (Object.keys(roll).length === 6) {
      // we've hit a full roll - now we've selected its banked dice, stop looking.
      break;
    }
  }

  return bankedDiceOfPreviousRolls;
};

const selectCurrentTurn = (state) => {
  const {
    currentRound: currentRoundId,
    currentTurn: currentTurnId,
    rounds,
  } = state.game;

  const currentTurnObj = rounds?.[currentRoundId]?.turns?.[currentTurnId];

  return currentTurnObj;
};

export const selectIsRollingCloud = (state) => {
  const currentTurn = selectCurrentTurn(state);

  if (!currentTurn) {
    return undefined;
  }

  const { isRolling } = currentTurn;

  return isRolling;
};

export const selectIsRolling = (state) => {
  const isShakingCupLocal = selectIsShakingCupLocal(state);
  const isRollingCloud = selectIsRollingCloud(state);
  const isRollDiceCloudFunctionRunning = selectIsRollDiceCloudFunctionRunning(
    state,
  );

  return isShakingCupLocal || isRollDiceCloudFunctionRunning || isRollingCloud;
};

const hasRolledSixOfAKind = (currentTurnObj) => {
  const { rolls } = currentTurnObj;

  if (!rolls || !Array.isArray(rolls)) {
    // if no rolls yet, no scoring groups, so they cant have
    return false;
  }

  return rolls.some((rollObj) => {
    const { scoringGroups } = rollObj;

    if (!scoringGroups || Object.keys(scoringGroups).length === 0) {
      return false;
    }

    return Object.values(scoringGroups).some(
      (sg) => sg.groupType === Constants.diceGroupTypes.sixOfAKind,
    );
  });
};

const selectMyCurrentScore = (state) => {
  const uid = selectUid(state);
  const allPlayers = selectPlayers(state);

  return allPlayers?.[uid]?.currentScore;
};

export const selectTurnScoreSoFar = (state) => {
  const currentTurnObj = selectCurrentTurn(state);
  const currentScore = selectMyCurrentScore(state);
  const isRolling = selectIsRolling(state); // dont return score = 0 if blapped but still rolling
  const isSinglePlayerGame = selectIsSinglePlayerGame(state);

  if (!currentTurnObj) {
    return undefined;
  }

  const { turnState, rolls } = currentTurnObj;

  if (!rolls || !Array.isArray(rolls)) {
    // if no rolls yet, no scoring groups
    return undefined;
  }

  const lastRollObj = rolls[rolls.length - 1];
  const { rollState } = lastRollObj;

  if (
    (turnState === Constants.TURN_STATES.BLAPPED ||
      rollState === Constants.ROLL_STATES.BLAPPED) &&
    !isRolling
  ) {
    return 0;
  }

  let turnScore;
  // exception to turn score calculation - rolling 6 of a kind - special 'insta-win' roll.
  // N.B. only if multiplayer game - if single player game, 6 of a kind doesn't insta-win, it
  // just scores 10000
  if (!isSinglePlayerGame && hasRolledSixOfAKind(currentTurnObj)) {
    turnScore = 10000 - currentScore;
  } else {
    // calculate turn score 'properly'
    turnScore = rolls.reduce((accumulator, rollObj, rollIndex) => {
      // each roll
      const { scoringGroups, rollState, rollType } = rollObj;
      const isLastRoll = rollIndex === rolls.length - 1;

      // problem - this error is thrown when there are no scoring groups in the current roll (ie every roll).
      // Need to make sure that it doesn't expect a scoring group in the final roll, unless it's done.

      // this deals with the special case of the 1st roll of "two throws to double it" not being
      // a 1 or 5 - it doesn't have any scoring groups but it's not blapped.
      if (!scoringGroups || Object.keys(scoringGroups).length === 0) {
        if (rollState === Constants.ROLL_STATES.BANKING_DICE) {
          // turn is in progress - ok for it to have no scoring types yet, the user is making them
          return accumulator;
        } else if (isLastRoll) {
          // the player may have rolled some scoring dice on the last roll, but chosen not to bank them and
          // just sticked.
          // TODO do we need both these top two conditions? Not sure atm.
          return accumulator;
        } else if (
          rollType === Constants.ROLL_TYPES.TWO_THROWS_TO_DOUBLE_IT.FIRST
        ) {
          return accumulator;
        } else {
          // we've already dealt with the blapped case above, so this should never happen
          // unless there's been an error
          throw new Error(
            "No scoring groups found for a roll that wasn't 'two throws to double it' and wasn't blapped",
          );
        }
      }

      const rollScore = Object.values(scoringGroups).reduce(
        (acc, scoringGroup) => {
          const { score } = scoringGroup;
          return acc + score;
        },
        0,
      );

      const rollWasASuccessful2ThrowsToDoubleIt =
        (rollType === Constants.ROLL_TYPES.TWO_THROWS_TO_DOUBLE_IT.FIRST ||
          rollType === Constants.ROLL_TYPES.TWO_THROWS_TO_DOUBLE_IT.SECOND) &&
        Object.keys(scoringGroups).length === 1;

      if (rollWasASuccessful2ThrowsToDoubleIt) {
        return 2 * (accumulator + rollScore);
      }
      return accumulator + rollScore;
    }, 0);
  }
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

  const { rollState } = currentRoll;

  return rollState === Constants.ROLL_STATES.BLAPPED;
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
export const selectPlayersInTurnOrder = (state) => {
  const turnOrder = selectPlayerTurnOrder(state);

  const allPlayers = selectPlayers(state);

  if (!turnOrder || !allPlayers) {
    return undefined;
  }

  return turnOrder.map((uid) => {
    const playerObj = allPlayers[uid];
    const avatarUrl = selectAvatarUrl(playerObj.avatarId)(state);
    return {
      uid,
      ...playerObj,
      avatarUrl,
    };
  });
};

// turnScores object shape:
// {
//   [roundIndex]: {
//    [turnIndex]: 600,
//    ...
//   },
//   ...
// }

export const selectAllTurnScores = (state) => {
  // get number of players, so we can set up the table to have the right number of cells
  const numberOfPlayers = selectNumberOfPlayers(state);

  // get each turn score and add to scores map
  const { rounds } = state.game;

  if (!rounds) {
    return undefined;
  }

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

export const selectPreviousTurnOutcome = (state) => {
  // select previous turn
  const {
    currentRound: currentRoundId,
    currentTurn: currentTurnId,
    rounds,
    players,
    gameType,
  } = state.game;

  let previousRoundId;
  let previousTurnId;
  if (currentRoundId === 0 && previousTurnId === 0) {
    return undefined;
  } else if (currentTurnId === 0) {
    // && currentRoundId !== 0
    previousRoundId = currentRoundId - 1;
    previousTurnId = Object.keys(players).length - 1;
  } else {
    previousRoundId = currentRoundId;
    previousTurnId = currentTurnId - 1;
  }

  const previousTurnObj = rounds?.[previousRoundId]?.turns?.[previousTurnId];

  if (!previousTurnObj) {
    return undefined;
  }

  // what was the outcome?
  const { turnState, turnScore, player } = previousTurnObj;
  let playerName;

  if (gameType === 'singlePlayer') {
    playerName = `Round ${currentRoundId}: you`;
  } else {
    playerName = selectPlayer(player)(state).name;
  }

  let outcome;
  if (turnState === Constants.TURN_STATES.STICKED) {
    outcome = `${playerName} scored ${turnScore} points.`;
  } else if (turnState === Constants.TURN_STATES.BLAPPED) {
    outcome = `${playerName} BLAPPED.`;
  } else if (turnState === Constants.TURN_STATES.STICKED_AND_OVERSHOT) {
    outcome = `${playerName}'s score exceeded 10,000 - BLAP.`;
  } else if (
    turnState === Constants.TURN_STATES.PLAYER_QUIT_GAME_DURING_THEIR_TURN
  ) {
    outcome = `${playerName} left the game.`;
  } else {
    outcome = undefined;
  }

  return outcome;
};
