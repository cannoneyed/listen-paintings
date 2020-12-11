import React, { useRef, useEffect } from "react";
import { autorun } from "mobx";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

import "./SoundSource.css";

import engine from "./engine";

const MIN_OPACITY = 0.5;
const MIN_SIZE = 80;
const DEFAULT_SIZE = 100;
const MAX_SIZE = 120;
const DEFAULT_RIPPLE_MULTIPLE = 1.1;
const RIPPLE_EXTENT = 120;

function amplify(gain) {
  return 1 - Math.pow(1 - gain, 20);
}

function SoundSource({ sound }) {
  const [xPercent, yPercent] = sound.position;
  const soundSourceRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    const dispose = autorun(() => {
      const gain = engine.soundSourceLevels.get(sound.file);
      const rippleGain = engine.soundSourceRipples.get(sound.file);

      if (gain === undefined) return;

      const soundSource = soundSourceRef.current;
      const ripple = rippleRef.current;

      let opacity = gain * (1 - MIN_OPACITY) + MIN_OPACITY;
      opacity = opacity * (1 - engine.overlayFade);
      const size = gain * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;

      soundSource.style.opacity = opacity;
      soundSource.style.width = `${size}px`;
      soundSource.style.height = `${size}px`;
      soundSource.style.marginLeft = `${-size / 2}px`;
      soundSource.style.marginTop = `${-size / 2}px`;

      const eased = amplify(rippleGain);
      const add = eased * RIPPLE_EXTENT;
      const rippleSize = size * DEFAULT_RIPPLE_MULTIPLE + add;

      ripple.style.opacity = opacity;
      ripple.style.width = `${rippleSize}px`;
      ripple.style.height = `${rippleSize}px`;
      ripple.style.marginLeft = `${-rippleSize / 2}px`;
      ripple.style.marginTop = `${-rippleSize / 2}px`;
    });
    return () => {
      dispose();
    };
  }, [sound]);

  const soundIconStyle = {
    width: `${DEFAULT_SIZE}px`,
    height: `${DEFAULT_SIZE}px`,
    marginLeft: `${-DEFAULT_SIZE / 2}px`,
    marginTop: `${-DEFAULT_SIZE / 2}px`,
    left: `${xPercent * 100}%`,
    top: `${yPercent * 100}%`,
    backgroundColor: sound.color,
    opacity: 0,
  };

  const rippleStyle = {
    width: `${DEFAULT_SIZE * DEFAULT_RIPPLE_MULTIPLE}px`,
    height: `${DEFAULT_SIZE * DEFAULT_RIPPLE_MULTIPLE}px`,
    marginLeft: `${-(DEFAULT_SIZE * DEFAULT_RIPPLE_MULTIPLE) / 2}px`,
    marginTop: `${-(DEFAULT_SIZE * DEFAULT_RIPPLE_MULTIPLE) / 2}px`,
    left: `${xPercent * 100}%`,
    top: `${yPercent * 100}%`,
    opacity: 0,
  };

  return (
    <>
      <div ref={rippleRef} className="ripple" style={rippleStyle}></div>
      <div
        id={sound.file}
        ref={soundSourceRef}
        className="sound-icon"
        style={soundIconStyle}
      >
        <VolumeUpIcon style={{ fontSize: 48 }} />
      </div>
    </>
  );
}

export default SoundSource;
