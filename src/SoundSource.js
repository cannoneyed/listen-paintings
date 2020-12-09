import React, { useRef, useEffect } from "react";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

import "./App.css";

import engine from "./engine";

const MIN_OPACITY = 0.5;
const MIN_SIZE = 40;
const DEFAULT_SIZE = 60;
const MAX_SIZE = 80;

function SoundSource({ sound }) {
  const [xPercent, yPercent] = sound.position;
  const soundSourceRef = useRef(null);

  useEffect(() => {
    const dispose = autorun(() => {
      const params = engine.getSoundSourceParams(sound.file);
      if (!params) return;
      const { gain } = params;

      const element = soundSourceRef.current;

      let opacity = gain * (1 - MIN_OPACITY) + MIN_OPACITY;
      opacity = opacity * (1 - engine.overlayFade);

      const size = gain * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;

      element.style.opacity = opacity;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.marginLeft = `${-size / 2}px`;
      element.style.marginTop = `${-size / 2}px`;
    });
    return () => {
      dispose();
    };
  }, []);

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

  return (
    <div
      id={sound.file}
      ref={soundSourceRef}
      className="sound-icon"
      style={soundIconStyle}
    >
      <VolumeUpIcon style={{ fontSize: 48 }} />
    </div>
  );
}

export default SoundSource;
