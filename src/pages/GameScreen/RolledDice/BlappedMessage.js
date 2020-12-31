import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';

import { isItMyTurn, selectGameId } from 'redux/game/selectors';
import blapSprites from 'media/sounds/blapSprites.mp3';
import spriteMap from 'media/sounds/blapSpriteMap';
import { usePlaySoundOnMount } from 'services/hooks';

const bulge = keyframes`
0% {
  transform: scale(0);
}
80% {
  transform: scale(1.1);
}
100% {
  transform: scale(1);
}
`;

const bounce = keyframes`
100% {
  transform: translateY(-10px);
  text-shadow: 0 1px 0 #4d0400, 0 2px 0 #4d0400, 0 3px 0 #4d0400, 0 4px 0 #4d0400,
    0 5px 0 #4d0400, 0 6px 0 #4d0400, 0 7px 0 #4d0400, 0 8px 0 #4d0400, 0 9px 0 #4d0400,
    0 50px 25px rgba(0, 0, 0, 0.5);
    // N.B. animating the text-shadow causes an elastic scrolling bug on webkit. Here it's fine because
    // the GameScreen is not scrollable.
}
`;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 3;
`;

const BlapText = styled.div`
  font-family: Limelight;
  font-size: 80px;
  color: #ff6961;
  letter-spacing: 1px;

  animation: ${bulge} 1s ease-in-out 1;

  span {
    position: relative;
    transform: translateY(10px);
    display: inline-block;

    animation: ${bounce} 0.3s ease infinite alternate;
    animation-delay: 1s;

    text-shadow: 0 1px 0 #4d0400, 0 2px 0 #4d0400, 0 3px 0 #4d0400,
      0 4px 0 #4d0400, 0 5px 0 #4d0400, 0 6px 0 transparent, 0 7px 0 transparent,
      0 8px 0 transparent, 0 9px 0 transparent, 0 10px 10px rgba(0, 0, 0, 0.7);
  }

  span:nth-child(2) {
    animation-delay: 1.1s;
  }

  span:nth-child(3) {
    animation-delay: 1.2s;
  }

  span:nth-child(4) {
    animation-delay: 1.3s;
  }

  span:nth-child(5) {
    animation-delay: 1.4s;
  }
`;

const delay = (t) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, t);
  });

const BlappedMessage = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);

  const blapNames = Object.keys(spriteMap);
  const randomIndex = Math.floor(Math.random() * blapNames.length);
  const randomSpriteName = blapNames[randomIndex];

  const gameIdRef = useRef(gameId);
  useEffect(() => {
    gameIdRef.current = gameId;

    return () => {
      gameIdRef.current = null;
    };
  }, [gameId]);

  const endTurnAfterBlap = async () => {
    if (!isMyTurn) {
      // console.log("not my turn - don't end turn after blap");
      return;
    }

    await delay(3000); // wait 3 seconds after end of blap sound end

    // check to make sure we still want to do this - it's possible that
    // the user rage quit the game immediately after blapping, in which case
    // the endTurnAfterBlap cloud function returns with a 400 error, which
    // the user sees in an ugly alert().
    // We need to use the `gameIdRef` ref so that we have the up to date value - if
    // we just used the gameId selected value, it would still have the old value.

    if (!gameIdRef.current) {
      // user has just quit the game
      return;
    }

    try {
      await firebase.functions().httpsCallable('endTurnAfterBlap')({
        gameId,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  usePlaySoundOnMount({
    soundFile: blapSprites,
    options: {
      sprite: spriteMap,
      onend: endTurnAfterBlap,
    },
    spriteName: randomSpriteName,
  });

  return (
    <Container>
      <BlapText>
        <span>B</span>
        <span>L</span>
        <span>A</span>
        <span>P</span>
        <span>!</span>
      </BlapText>
    </Container>
  );
};

export default BlappedMessage;
