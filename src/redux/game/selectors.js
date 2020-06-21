// import moment from 'moment';
import { selectUid } from 'redux/auth/selectors';
import { selectAllAvatars } from 'redux/avatars/selectors';

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

export const selectCurrentPage = (state) => state.game.currentPage;

export const selectPageId = (state) => state.game.currentPage.id;

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

export const selectAmICurrentKing = (state) => {
  const uid = selectUid(state);

  if (
    !uid ||
    !state.game ||
    !state.game.currentPage ||
    !state.game.currentPage.currentKing
  ) {
    return false;
  }

  const currentKing = state.game.currentPage.currentKing;

  return uid === currentKing;
};

export const selectRole = (state) => {
  const uid = selectUid(state);
  const allPlayers = selectPlayers(state);

  if (!uid || !allPlayers) {
    return undefined;
  }

  const { role } = allPlayers[uid];

  return role;
};

export const selectMyAvatarUrl = (state) => {
  const avatarId = state.auth.avatarId;
  const avatars = selectAllAvatars(state);

  if (typeof avatarId !== 'number' || !avatars) {
    return undefined;
  }

  return avatars[avatarId];
};

export const selectAvatarUrl = (avatarId) => (state) => {
  const avatars = selectAllAvatars(state);

  if (typeof avatarId !== 'number' || !avatars) {
    return undefined;
  }

  return avatars[avatarId];
};

export const selectAllAvatarsWithChosenStatus = (state) => {
  const allAvatars = selectAllAvatars(state);

  console.log('allAvatars', allAvatars);

  const allPlayers = selectPlayers(state);

  console.log('allPlayers', allPlayers);

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

export const selectScores = (state) => state.game.scores;
