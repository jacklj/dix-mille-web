import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TimerStyled, TimeText, PauseIcon } from './styledComponents';
import { calculateTimerValue, renderTime } from './helpers';
// import Constants from 'services/constants';

// const { PAGE_TYPES } = Constants;

// # Timer notes:
//   - can go both up and down
// # All timer events:
//  -

class Timer extends Component {
  constructor(props) {
    super(props);
    let state;
    // Timer state: { timerValueMs, intervalTimerId }
    const {
      countDirection,
      isPaused,
      timeStarted,
      timeLeftOrElapsedWhenLastStarted,
      // currentPageType,
    } = this.props;

    if (!isPaused && !timeStarted) {
      // timer should be running but no timeStarted timestamp set - this is inconsistent,
      // so we most likely just haven't got the data in redux store yet. Don't do anything.
      state = {
        timerValueMs: undefined,
        intervalTimerId: undefined,
      };
    } else if (
      isPaused &&
      !timeLeftOrElapsedWhenLastStarted &&
      timeLeftOrElapsedWhenLastStarted !== 0
    ) {
      // paused but no timeLeftElapsed defined - another inconsistent state
      state = {
        timerValueMs: undefined,
        intervalTimerId: undefined,
      };
    } else if (
      isPaused &&
      (timeLeftOrElapsedWhenLastStarted ||
        timeLeftOrElapsedWhenLastStarted === 0)
    ) {
      // page loaded and timer was already paused - set timeValueMs to timeLeftOrElapsedWhenLastStarted
      state = {
        timerValueMs: timeLeftOrElapsedWhenLastStarted,
        intervalTimerId: undefined,
      };
    } else if (!isPaused && timeStarted) {
      const timeStartedAsDate = new Date(timeStarted);
      const timerValueMs = calculateTimerValue({
        // initialise timer with correct value
        countDirection,
        timeLeftOrElapsedWhenLastStarted,
        timeStarted: timeStartedAsDate,
      });
      const intervalTimerId = setInterval(this.tick, 100);
      state = {
        timerValueMs,
        intervalTimerId,
      };
    } else {
      throw new Error('Unrecognised timer condition.', this.props);
    }

    this.state = state;
  }

  // componentDidUpdate detects changes in props and state. We need it to detect if
  // isPaused changes (ie the game is paused or unpaused),
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isPaused && !this.props.timeStarted) {
      // Timer should be running (and not on Start Page) but no timeStarted timestamp set - this
      // is inconsistent, so we most likely just haven't got the data in redux store yet. Don't
      // do anything.
      return;
    }

    if (
      this.props.isPaused &&
      !this.state.intervalTimerId &&
      !prevState.timerValueMs
    ) {
      // page loaded and timer was already paused - set timeValueMs to timeLeftOrElapsedWhenLastStarted
      if (
        this.state.timerValueMs !== this.props.timeLeftOrElapsedWhenLastStarted
      ) {
        this.setState({
          timerValueMs: this.props.timeLeftOrElapsedWhenLastStarted,
        });
      }
      return;
    } else if (!prevProps.isPaused && this.props.isPaused) {
      // either the game just paused, or the game was already paused when the
      // game data was loaded into the redux store
      if (!this.state.intervalTimerId) {
        throw new Error('Game just paused, but no interval timer was running?');
      }
      // if the game just paused, stop the timer
      clearInterval(this.state.intervalTimerId);
      this.setState({ intervalTimerId: undefined });
    } else if (!this.props.isPaused && !this.state.intervalTimerId) {
      // also set the initial timerValueMs value (for the first 100ms before this.tick() has run the first time?)
      const {
        countDirection,
        timeLeftOrElapsedWhenLastStarted,
        timeStarted,
      } = this.props;

      const timeStartedAsDate = new Date(timeStarted);

      this.setState({
        timerValueMs: calculateTimerValue({
          // initialise timer with correct value
          countDirection,
          timeLeftOrElapsedWhenLastStarted,
          timeStarted: timeStartedAsDate,
        }),
        intervalTimerId: setInterval(this.tick, 100),
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalTimerId);
    this.setState({ intervalTimerId: undefined });
  }

  tick = () => {
    const {
      countDirection,
      timeLeftOrElapsedWhenLastStarted,
      timeStarted,
    } = this.props;
    if (!timeStarted) {
      return;
    }

    const timeStartedAsDate = new Date(timeStarted);

    const timerValueMs = calculateTimerValue({
      countDirection,
      timeLeftOrElapsedWhenLastStarted,
      timeStarted: timeStartedAsDate,
    });

    if (timerValueMs < 0) {
      this.props.onFinish();
      clearInterval(this.state.intervalTimerId);
      this.setState({ intervalTimerId: undefined, timerValueMs: 0 });
    } else {
      this.setState({ timerValueMs });
    }
  };

  render() {
    const { isPaused, style } = this.props;

    const prettyTime =
      typeof this.state.timerValueMs === 'number'
        ? renderTime(this.state.timerValueMs)
        : 'loading';
    return (
      <TimerStyled isPaused={isPaused} style={style}>
        {isPaused && PauseIcon}
        <TimeText>{prettyTime}</TimeText>
      </TimerStyled>
    );
  }
}

Timer.defaultProps = {
  onFinish: () => {},
  countDirection: 'down',
  timeStarted: null,
  currentPageType: undefined,
};

Timer.propTypes = {
  timeStarted: PropTypes.number.isRequired,
  timeLeftOrElapsedWhenLastStarted: PropTypes.number.isRequired,
  isPaused: PropTypes.bool.isRequired,
  countDirection: PropTypes.oneOf(['up', 'down']),
  onFinish: PropTypes.func,
  currentPageType: PropTypes.string,
};

export default Timer;
