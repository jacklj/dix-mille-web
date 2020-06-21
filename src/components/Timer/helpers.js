import moment from 'moment';

export const calculateTimerValue = ({
  countDirection,
  timeLeftOrElapsedWhenLastStarted,
  timeStarted,
}) => {
  const now = moment();
  const timeElapsedSinceStarted = now.diff(timeStarted); // in ms
  // number of ms between the timestamp when the timer was just started and now

  let timerValueMs;
  if (countDirection === 'up') {
    timerValueMs = timeLeftOrElapsedWhenLastStarted + timeElapsedSinceStarted;
  } else if (countDirection === 'down') {
    timerValueMs = timeLeftOrElapsedWhenLastStarted - timeElapsedSinceStarted;
    if (timerValueMs < 0) {
      // in case the timer elapsed, and then we opened the operator app some time later
      timerValueMs = 0;
    }
  } else {
    throw new Error('Unrecognised Timer countDirection', countDirection);
  }
  return timerValueMs;
};

const renderNumberWithLeading0 = (number) => {
  let prettyNumber;
  if (!number || number <= 0) {
    prettyNumber = '00';
  } else if (number > 0 && number < 10) {
    prettyNumber = `0${number}`;
  } else {
    prettyNumber = number;
  }
  return prettyNumber;
};

export const renderTime = (timeInMs) => {
  const mins = Math.floor(timeInMs / 60000);
  const prettyMins = renderNumberWithLeading0(mins);
  const secs = Math.floor(timeInMs / 1000) % 60;
  const prettySecs = renderNumberWithLeading0(secs);
  return `${prettyMins}:${prettySecs}`;
};
