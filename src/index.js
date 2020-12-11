import React from "react";
import ReactDOM from "react-dom";
import { configure } from "mobx";

import "./index.css";
import App from "./App";

import { paintingsData } from "./data";
import engine from "./engine";

configure({
  enforceActions: "never",
});

const params = Object.fromEntries(new URLSearchParams(window.location.search));
const whichPainting = params.painting;
const painting =
  paintingsData.find((p) => p.key === whichPainting) ?? paintingsData[1];

engine.setPainting(painting);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
