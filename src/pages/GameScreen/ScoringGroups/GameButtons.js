import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';
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
  selectAreAnyBankedDiceInvalid,
} from 'redux/game/selectors';

import { Button } from 'components/forms';
import { selectIsSoundOn } from 'redux/settings/selectors';
import shakingDiceSound from 'media/sounds/shakingDice.mp3';
import castingDiceSprites from 'media/sounds/castingDiceSprites.mp3';
import spriteMap from 'media/sounds/castingDiceSpriteMap';

const padding = 3;

const Colours = {
  disabled: 'rgb(180, 176, 85)',
  normal: '#ffdc73',
  hover: '#ffbf00',
  active: '#ffbf00',
};

const Container = styled.div`
  flex: none;
  align-self: stretch;

  z-index: 0; // establish stacking context for pages (so Overlay is always on top)

  display: flex;
  justify-content: center;
  align-items: stretch;

  border: none;
  border-top: 5px solid ${Colours.disabled};

  border-radius: 50px;
  padding: ${padding}px;

  @media (min-width: 900px) {
    width: 850px;
    align-self: center;

    border: 5px solid ${Colours.disabled};
    margin-bottom: 10px;
  }
`;

const CustomButton = styled(Button)`
  flex: 1;

  // override any margin or padding
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;

  // single border, rather than double
  border-radius: 0;
  border-width: 5px;
  border-style: solid;

  &:hover {
    border-width: 5px;
    border-style: solid;
  }

  &:active {
    border-width: 5px;
    border-style: solid;
  }

  // middle button margin (N.B. nth-child is 1-indexed)
  &:nth-child(2) {
    margin-left: ${padding}px;
    margin-right: ${padding}px;
  }

  // edges of buttons component are rounded
  &:first-child {
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }

  &:last-child {
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
  }
`;

const GameButtons = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);
  const currentRoll = useSelector(selectCurrentRoll);
  const isRollingCloud = useSelector(selectIsRolling);
  const areAnyBankedDiceInvalid = useSelector(selectAreAnyBankedDiceInvalid);

  const currentScoringGroups = useSelector(selectCurrentScoringGroups);

  const isBlapped = useSelector(selectIsBlapped);
  const isFirstOfTwoThrowsToDoubleIt = useSelector(
    selectIsFirstOfTwoThrowsToDoubleIt,
  );

  const [isHoldingDownRollButton, setIsHoldingDownRollButton] = useState(false);
  const [
    isFinishingTurnAfterBlapping,
    setIsFinishingTurnAfterBlapping,
  ] = useState(false);

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
  const isRolling = isRollingCloud || isHoldingDownRollButton;
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
  const previousIsHoldingDownRollButton = useRef(false);
  const previousIsRollingCloud = useRef(false);

  useEffect(() => {
    // console.log('effect ran', isHoldingDownRollButton, isRollingCloud);
    if (!isMyTurn) {
      // console.log('not your turn - dont run effect');
      return;
    }

    if (isRollingCloud && !isHoldingDownRollButton) {
      console.log('PREVENT RACE CONDITION');
      const writeIsRollingFalse = async () => {
        const path = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/isRolling`;
        await firebase.database().ref(path).set(false);
      };
      writeIsRollingFalse();
    }

    // update 'previous' values
    previousIsHoldingDownRollButton.current = isHoldingDownRollButton;
    previousIsRollingCloud.current = isRollingCloud;
  }, [
    currentRoundId,
    currentTurnId,
    gameId,
    isHoldingDownRollButton,
    isMyTurn,
    isRollingCloud,
  ]);

  const startShakingDice = async (event) => {
    // if both touch and mouse events are fired by the browser (ie onTouchStart and onMouseDown),
    // `event.preventDefault()` is called by the first, and prevents the second from happening
    event.preventDefault();

    // console.log('mouse down');

    if (isHoldingDownRollButton) {
      // already pressing the button (somehow?) - don't do anything
      alert("Already pressing the roll button - can't press it again?");
      return;
    }

    setIsHoldingDownRollButton(true);

    if (!isMyTurn) {
      alert("You can't roll - it's not your turn!");
      setIsHoldingDownRollButton(false);
      return;
    }

    if (areAnyBankedDiceInvalid) {
      alert("There are invalid banked dice - can't reroll.");
      setIsHoldingDownRollButton(false);
      return;
    }

    const hasRolled = !!currentRoll;
    const noScoringGroups =
      !currentScoringGroups || Object.keys(currentScoringGroups).length === 0;
    const noBankedDice =
      hasRolled && noScoringGroups && !isFirstOfTwoThrowsToDoubleIt;

    if (noBankedDice) {
      alert('You need to bank at least one dice before rolling again.');
      setIsHoldingDownRollButton(false);
      return;
    }

    try {
      await firebase.functions().httpsCallable('rollDice')({
        gameId,
      });
      // console.log('cf returned!');

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
      alert(error.message);
      // write isRolling: false to DB (or catch error in cloud function and do this?)
      // setIsHoldingDownRollButton(false);
    }
  };

  const stopShakingDiceAndThrow = async (event) => {
    // if both touch and mouse events are fired by the browser (ie onTouchEnd and onMouseUp),
    // `event.preventDefault()` is called by the first, and prevents the second from happening
    event.preventDefault();

    // console.log('mouse up');

    if (!isHoldingDownRollButton) {
      // console.log('isnt holding down roll button - dont do anything');
      // user wasn't holding the button down - dont do anything
      return;
    }

    setIsHoldingDownRollButton(false);

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

  const endTurnAfterBlap = async () => {
    setIsFinishingTurnAfterBlapping(true);

    if (!isMyTurn) {
      alert("You can't end the turn - it's not your turn!");
      setIsFinishingTurnAfterBlapping(false);
      return;
    }

    try {
      const res = await firebase.functions().httpsCallable('endTurnAfterBlap')({
        gameId,
      });
      // console.log(res);
    } catch (error) {
      alert(error.message);
    }

    setIsFinishingTurnAfterBlapping(false);
  };

  const hasRolled = !!currentRoll;

  let canEndTurnAfterBlap, isRollDisabled, isRollLoading;

  if (!isMyTurn) {
    // not your turn - all disabled.
    canEndTurnAfterBlap = false;
    isRollDisabled = true;
    isRollLoading = false;
  } else if (isRolling) {
    // it's your turn and you're rolling
    canEndTurnAfterBlap = false;
    isRollDisabled = false;
    isRollLoading = true;
  } else if (!hasRolled) {
    // it's your turn, you're not rolling, and you haven't rolled yet
    canEndTurnAfterBlap = false;
    isRollDisabled = false;
    isRollLoading = false;
  } else if (isBlapped) {
    // it's your turn, you've rolled with a blap.
    canEndTurnAfterBlap = !isFinishingTurnAfterBlapping;
    isRollDisabled = true;
    isRollLoading = false;
  } else {
    // it's your turn, you've rolled, and you havent blapped.
    canEndTurnAfterBlap = false;

    const noScoringGroups =
      !currentScoringGroups || Object.keys(currentScoringGroups).length === 0;
    isRollDisabled =
      (noScoringGroups && !isFirstOfTwoThrowsToDoubleIt) ||
      areAnyBankedDiceInvalid;
    isRollLoading = false;
  }

  return (
    <>
      <Container>
        {isBlapped && !isRollLoading ? (
          <CustomButton
            onClick={() => endTurnAfterBlap()}
            disabled={!canEndTurnAfterBlap}
            loading={isFinishingTurnAfterBlapping}>
            Next
          </CustomButton>
        ) : null}
      </Container>
    </>
  );
};

export default GameButtons;
