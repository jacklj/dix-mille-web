// import moment from 'moment';
import { selectUid } from 'redux/auth/selectors';
import { selectAllAvatars } from 'redux/avatars/selectors';

export const selectGameCode = (state) => state.game.gameCode;

export const selectGameId = (state) => state.game.gameId;

export const selectScenario = (state) => state.game.scenario;

export const selectUser = (uid) => (state) => state.game.users[uid];

const selectUsers = (state) => state.game.users;

export const selectOtherUsersWithFilledOutProfiles = (state) => {
  const myUid = state.auth.uid;
  const allUsers = { ...selectUsers(state) };

  delete allUsers[myUid];

  const otherUsersUids = Object.keys(allUsers)
    .map((uid) => {
      const value = allUsers[uid];
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
    .filter((user) => user.name) // if they havent filled out their profile yet, dont display them in Waiting Room
    .map((userObj) => userObj.uid);

  return otherUsersUids;
};

export const selectCurrentPage = (state) => state.game.currentPage;

export const selectPageId = (state) => state.game.currentPage.id;

export const selectStartedAt = (state) => state.game.currentPage.startedAt;

export const selectUidToNameMap = (state) => {
  if (!state.game.users) {
    return undefined;
  }

  const uidToNameMap = {};

  Object.keys(state.game.users).forEach((uid) => {
    uidToNameMap[uid] = state.game.users[uid].name;
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

  if (!uid || !state.game.users) {
    return undefined;
  }

  const { role } = state.game.users[uid];

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
  const avatars = []; // state.definitions.avatars;

  if (typeof avatarId !== 'number' || !avatars) {
    return undefined;
  }

  return avatars[avatarId];
};

export const selectAllAvatarsWithChosenStatus = (state) => {
  const allAvatars = selectAllAvatars(state);

  console.log('allAvatars', allAvatars);

  const allGameUsers = selectUsers(state);

  console.log('allGameUsers', allGameUsers);

  if (!allAvatars || allAvatars.length === 0 || !allGameUsers) {
    return undefined;
  }

  const alreadyUsedAvatars = {};

  Object.values(allGameUsers).forEach((user) => {
    const { avatarId } = user;
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
