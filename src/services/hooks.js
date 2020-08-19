import { useEffect, useCallback } from 'react';
import useSound from 'use-sound';
import { useSelector } from 'react-redux';

import { selectIsSoundOn } from 'redux/settings/selectors';

/*
 * Plays a sound on component mount.
 * Can be a plain sound file, or with sprites - in that case, specify the sprite map in `options`,
 * and include a `spriteName`.
 * This hook ensures that the sound setting is switched on, and also doesn't replay the sound when
 * the sound setting is switched back on.
 */
export const usePlaySoundOnMount = ({ soundFile, options, spriteName }) => {
  const isSoundOn = useSelector(selectIsSoundOn);

  const [play, { isPlaying, stop }] = useSound(soundFile, options);

  // use `useCallback` so we have the latest value of `isSoundOn` without it being in the useEffect
  // dependency list, as in that case, every time the user switches the sound on, this component would
  // play a sound effect.
  const onMount = useCallback(() => {
    // on mount, play it
    if (!isSoundOn) {
      // dont just play it when sound is turned on!
      return;
    }

    play(spriteName ? { id: spriteName } : undefined);
  }, [isSoundOn, play, spriteName]);

  useEffect(onMount, [play]);
  // N.B. must have playBlapSound in the dep list, or doesn't work.
  // This is becase the first time the `useSound` hook is run, it starts lazy loading the Howler lib.
  // So the first value of playBlapSound can't play any sound - it's the second value that works

  useEffect(() => {
    if (isPlaying && !isSoundOn) {
      stop();
    }
  }, [isPlaying, isSoundOn, stop]);
};
