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
