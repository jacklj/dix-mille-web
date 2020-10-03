import React, { useEffect, useRef } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector, useDispatch } from 'react-redux';
import useSound from 'use-sound';

import {
  isItMyTurn,
  selectGameId,
  selectCurrentRoll,
  selectIsBlapped,
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentScoringGroups,
  selectIsFirstOfTwoThrowsToDoubleIt,
  selectIsRolling,
  selectIsRollingCloud,
  selectAreAnyBankedDiceInvalid,
} from 'redux/game/selectors';
import { selectIsSoundOn } from 'redux/settings/selectors';
import {
  startedShakingCupLocal,
  stoppedShakingCupLocal,
  rollDiceCloudFunctionReturned,
} from 'redux/ui/slice';
import { selectIsShakingCupLocal } from 'redux/ui/selectors';
import shakingDiceSound from 'media/sounds/shakingDice.mp3';
import castingDiceSprites from 'media/sounds/castingDiceSprites.mp3';
import spriteMap from 'media/sounds/castingDiceSpriteMap';
import DumbDiceCup from './DiceCup';

const SmartDiceCup = () => {
  const dispatch = useDispatch();
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);
  const currentRoll = useSelector(selectCurrentRoll);
  const isRolling = useSelector(selectIsRolling);
  const isShakingCupLocal = useSelector(selectIsShakingCupLocal);
  const isRollingCloud = useSelector(selectIsRollingCloud);
  const areAnyBankedDiceInvalid = useSelector(selectAreAnyBankedDiceInvalid);

  const currentScoringGroups = useSelector(selectCurrentScoringGroups);

  const isBlapped = useSelector(selectIsBlapped);
  const isFirstOfTwoThrowsToDoubleIt = useSelector(
    selectIsFirstOfTwoThrowsToDoubleIt,
  );

  // play dice shaking sound
  const isSoundOn = useSelector(selectIsSoundOn);

  const [playShakingSound, { stop: stopShakingSound, sound }] = useSound(
    shakingDiceSound,
    {
      interrupt: false, // if already playing, dont play again and overlap
      soundEnabled: isSoundOn,
      loop: true,
    },
  );
  useEffect(() => {
    // console.log('sound effect fired', isRolling);
    if (isRolling) {
      // start playing sound if its not already playing
      // start in random position
      const lengthInS = 30; // actually 35s
      const randomPosition = Math.random() * lengthInS;
      sound && sound.seek(randomPosition);
      // console.log('play from ', randomPosition);
      playShakingSound();
    } else {
      stopShakingSound();
    }
  }, [isRolling, playShakingSound, sound, stopShakingSound]);

  // play dice casting sound
  const [playCastingSound] = useSound(castingDiceSprites, {
    sprite: spriteMap,
    interrupt: false, // if a sound is already playing, overlap it (rather than stopping it when starting a new one)
    soundEnabled: isSoundOn, // not reactive...
    // loop: true, // can't `stop()` looped sounds after the first loop...
  });

  const previousIsRolling = useRef(false);
  useEffect(() => {
    const justStoppedRolling = previousIsRolling.current && !isRolling;
    if (justStoppedRolling) {
      const spriteNames = Object.keys(spriteMap);
      const randomIndex = Math.floor(Math.random() * spriteNames.length);
      const randomSpriteName = spriteNames[randomIndex];

      // console.log(`play '${randomSpriteName}'`);
      playCastingSound({ id: randomSpriteName });
    }

    previousIsRolling.current = isRolling;
  }, [isRolling, playCastingSound]);

  // do an effect for [isHoldingDownRollButton, isRollingCloud] - sets
  // isRolling to true when isHoldingDownRollButton !x => x, and to false
  // on the second of either going from x => !x
  // NB could there be a race condition when, for some reason, the 'stop rolling'
  // instruction reaches DB before the 'start rolling' one does????? TODO
  const previousIsShakingCupLocal = useRef(false);
  const previousIsRollingCloud = useRef(false);

  useEffect(() => {
    // console.log('effect ran', isHoldingDownRollButton, isRollingCloud);
    if (!isMyTurn) {
      // console.log('not your turn - dont run effect');
      return;
    }

    if (isRollingCloud && !isShakingCupLocal) {
      console.log('PREVENT RACE CONDITION');
      const writeIsRollingFalse = async () => {
        const path = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/isRolling`;
        await firebase.database().ref(path).set(false);
      };
      writeIsRollingFalse();
    }

    // update 'previous' values
    previousIsShakingCupLocal.current = isShakingCupLocal;
    previousIsRollingCloud.current = isRollingCloud;
  }, [
    currentRoundId,
    currentTurnId,
    gameId,
    isShakingCupLocal,
    isMyTurn,
    isRollingCloud,
  ]);

  const startShakingDice = async (event) => {
    // if both touch and mouse events are fired by the browser (ie onTouchStart and onMouseDown),
    // `event.preventDefault()` is called by the first, and prevents the second from happening
    event.preventDefault();

    if (isBlapped) {
      console.warn("Can't roll dice when blapped.");
      return;
    }

    if (isShakingCupLocal) {
      // already pressing the button (somehow?) - may have got stuck rolling - stop rolling.
      stopShakingDiceAndThrow();
      return;
    }

    if (!isMyTurn) {
      alert("You can't roll - it's not your turn!");
      return;
    }

    if (areAnyBankedDiceInvalid) {
      alert("There are invalid banked dice - can't reroll.");
      return;
    }

    dispatch(startedShakingCupLocal());

    const hasRolled = !!currentRoll;
    const noScoringGroups =
      !currentScoringGroups || Object.keys(currentScoringGroups).length === 0;
    const noBankedDice =
      hasRolled && noScoringGroups && !isFirstOfTwoThrowsToDoubleIt;

    if (noBankedDice) {
      alert('You need to bank at least one dice before rolling again.');
      dispatch(stoppedShakingCupLocal());
      return;
    }

    try {
      await firebase.functions().httpsCallable('rollDice')({
        gameId,
      });
      // console.log('cf returned!');
      dispatch(rollDiceCloudFunctionReturned());

      // if (!isHoldingDownRollButton) {
      //   // when the cf returned, user had already let go of Roll button
      //   console.log(
      //     'when roll cf returned, user had already let go of roll button - write isRolling: false to DB',
      //     isHoldingDownRollButton,
      //   );
      //   const path = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/isRolling`;
      //   await firebase.database().ref(path).set(false);

      //   // setIsHoldingDownRollButton(false);
      // }
    } catch (error) {
      dispatch(rollDiceCloudFunctionReturned());
      alert(error.message);
      // write isRolling: false to DB (or catch error in cloud function and do this?)
      // setIsHoldingDownRollButton(false);
    }
  };

  const stopShakingDiceAndThrow = async (event) => {
    // if both touch and mouse events are fired by the browser (ie onTouchEnd and onMouseUp),
    // `event.preventDefault()` is called by the first, and prevents the second from happening
    // N.B. check event exists before calling .preventDefault(), because startShakingDice() can
    // manually call stopShakingDiceAndThrow().
    event && event.preventDefault();

    if (!isShakingCupLocal) {
      // console.log('isnt holding down roll button - dont do anything');
      // user wasn't holding the button down - dont do anything
      return;
    }

    dispatch(stoppedShakingCupLocal());

    if (!isRollingCloud) {
      // cloud function hasn't returned yet - dont write to DB
      // console.log(
      //   '[rollDiceMouseUp] cf hasnt returned yet - dont write isRolling: false',
      // );
      return;
    }

    // TODO check that roll has been received
    // console.log(
    //   'user let go of roll button, and roll has been received - set isRolling: false',
    // );
    const path = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/isRolling`;
    await firebase.database().ref(path).set(false);
  };

  const hasRolled = !!currentRoll;

  let isRollDisabled, isRollLoading;

  if (!isMyTurn) {
    // not your turn - all disabled.

    isRollDisabled = true;
    isRollLoading = false;
  } else if (isRolling) {
    // it's your turn and you're rolling

    isRollDisabled = false;
    isRollLoading = true;
  } else if (!hasRolled) {
    // it's your turn, you're not rolling, and you haven't rolled yet

    isRollDisabled = false;
    isRollLoading = false;
  } else if (isBlapped) {
    // it's your turn, you've rolled with a blap.

    isRollDisabled = true;
    isRollLoading = false;
  } else {
    // it's your turn, you've rolled, and you havent blapped.
    const noScoringGroups =
      !currentScoringGroups || Object.keys(currentScoringGroups).length === 0;
    isRollDisabled =
      (noScoringGroups && !isFirstOfTwoThrowsToDoubleIt) ||
      areAnyBankedDiceInvalid;
    isRollLoading = false;
  }

  return (
    <DumbDiceCup
      onMouseDown={startShakingDice}
      onTouchStart={startShakingDice}
      onMouseUp={stopShakingDiceAndThrow}
      onTouchEnd={stopShakingDiceAndThrow}
      onMouseLeave={stopShakingDiceAndThrow}
      // onClick={() => {}}
      disabled={isRollDisabled}
      // N.B. the `loading` prop won't cause the underlying <button> element to be disabled,
      // becase we have defined onMouseUp and onMouseLeave event handlers. Disabing the button would
      // prevent these from firing.
      loading={isRollLoading}
      isShaking={isRolling}
    />
  );
};

export default SmartDiceCup;
