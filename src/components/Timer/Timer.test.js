import React from 'react';
import renderer from 'react-test-renderer';
import Timer from './index';

it('renders correctly', () => {
  const timeStarted = Date.now();
  const isPaused = false;
  const timeLeftOrElapsedWhenLastStarted = 20000;
  const tree = renderer
    .create(
      <Timer
        timeStarted={timeStarted}
        timeLeftOrElapsedWhenLastStarted={timeLeftOrElapsedWhenLastStarted}
        isPaused={isPaused}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly when paused', () => {
  const timeStarted = Date.now();
  const isPaused = true;
  const timeLeftOrElapsedWhenLastStarted = 20000;
  const tree = renderer
    .create(
      <Timer
        timeStarted={timeStarted}
        timeLeftOrElapsedWhenLastStarted={timeLeftOrElapsedWhenLastStarted}
        isPaused={isPaused}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
