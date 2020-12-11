import React from "react";
import { observer } from "mobx-react-lite";

import "./App.css";

import Overlay from "./Overlay";
import SoundSource from "./SoundSource";

import engine from "./engine";

function App() {
  const { painting } = engine;
  const imageUrl = `${process.env.PUBLIC_URL}/paintings/${painting.key}/image.jpg`;

  return (
    <div className="App">
      <div className="image-container">
        {engine.isOverlayVisible ? <Overlay /> : null}

        {painting.sounds.map((sound) => {
          return <SoundSource key={sound.file} sound={sound} />;
        })}

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
