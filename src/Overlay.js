import React from "react";
import { observer } from "mobx-react-lite";

import engine from "./engine";

import "./Overlay.css";

const OVERLAY_OPACITY = 0.75;

export function Overlay() {
  const overlayStyle = {
    opacity: engine.overlayFade * OVERLAY_OPACITY,
  };

  return (
    <div className="overlay" style={overlayStyle}>
      {engine.isLoaded ? (
        <span
          className="state loaded"
          onClick={() => {
            engine.fadeOutOverlay();
            engine.playSounds();
          }}
        >
          Start
        </span>
      ) : (
        <div className="state loading">Loading...</div>
      )}
    </div>
  );
}

export default observer(Overlay);
