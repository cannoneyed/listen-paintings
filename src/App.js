import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

import "./App.css";

import { paintingsData } from "./data";
import audio from "./audio";

const painting = paintingsData[2];
audio.setSounds(painting.key, painting.sounds);

autorun(() => {
  console.log("🔥", audio.isLoaded);
});

function App() {
  const [isOverlayShown, setIsOverlayShown] = useState(true);
  useEffect(() => {
    const mouseMove = (e) => {
      const windowInnerWidth = window.innerWidth;
      const windowInnerHeight = window.innerHeight;
      audio.setSoundPosition(
        e.pageX / windowInnerWidth,
        e.pageY / windowInnerHeight
      );
    };
    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const imageUrl = `${process.env.PUBLIC_URL}/${painting.key}/image.jpg`;
  const showHideOverlay = isOverlayShown ? "shown" : "hidden";

  return (
    <div className="App">
      <div className="image-container">
        <div className={`overlay ${showHideOverlay}`}>
          {audio.isLoaded ? (
            <span
              className="state loaded"
              onClick={() => {
                setIsOverlayShown(false);
                audio.playSounds();
              }}
            >
              Start
            </span>
          ) : (
            <div className="state loading">Loading...</div>
          )}
        </div>

        {!isOverlayShown
          ? painting.sounds.map((sound) => {
              const [xPercent, yPercent] = sound.position;
              const soundIconStyle = {
                marginLeft: `${-60 / 2}px`,
                marginTop: `${-60 / 2}px`,
                left: `${xPercent * 100}%`,
                top: `${yPercent * 100}%`,
                backgroundColor: sound.color,
              };
              return (
                <div
                  key={sound.file}
                  id={sound.file}
                  className="sound-icon"
                  style={soundIconStyle}
                >
                  <VolumeUpIcon style={{ fontSize: 48 }} />
                </div>
              );
            })
          : null}

        <img src={imageUrl} className="painting" alt="" />

        <div className="image-description">
          <span className="title">{painting.name}</span>
          <span className="artist">{painting.artist}</span>
        </div>
      </div>
    </div>
  );
}

export default observer(App);
