import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";

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
      audio.setSoundPosition(e.pageX, e.pageY);
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
