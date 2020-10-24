import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { hideOverlay } from 'redux/ui/slice';
import { selectCurrentlyDisplayedOverlay } from 'redux/ui/selectors';
import CONSTANTS from 'services/constants';

import ScoresPopover from './ScoresPopover';
import RulesPopover from './RulesPopover';

import MenuPopover from './MenuPopover';

const Overlays = () => {
  const dispatch = useDispatch();
  const currentlyDisplayedOverlay = useSelector(
    selectCurrentlyDisplayedOverlay,
  );

  const hideAnyOverlay = () => dispatch(hideOverlay());

  let overlayJsx;

  switch (currentlyDisplayedOverlay) {
    case CONSTANTS.OVERLAYS.SCORES:
      overlayJsx = <ScoresPopover hideScores={hideAnyOverlay} />;
      break;
    case CONSTANTS.OVERLAYS.RULES:
      overlayJsx = <RulesPopover hideRules={hideAnyOverlay} />;
      break;
    case CONSTANTS.OVERLAYS.MENU:
      overlayJsx = <MenuPopover hideMenu={hideAnyOverlay} />;
      break;

    default:
      overlayJsx = null;
  }

  return overlayJsx;
};

export default Overlays;
