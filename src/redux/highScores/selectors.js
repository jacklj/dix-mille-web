import { selectAvatarUrl } from 'redux/game/selectors';

export const selectHighScores = (state) => {
  const scoresList = state.highScores.scores;

  // replace avatar IDs with avatar URLs here, for convenience
  const withAvatarUrls = scoresList.map((score) => ({
    ...score,
    avatarUrl: score.avatarId && selectAvatarUrl(score.avatarId)(state),
  }));

  return withAvatarUrls;
};
