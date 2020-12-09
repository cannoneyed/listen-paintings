import * as Tone from "tone";
import AnimatedValue from "animated-value";
import { makeObservable, observable, computed } from "mobx";

const DEFAULT_DECIBELS = -12;

class Engine {
  painting = null;
  players = new Map();
  loadedSounds = new Map();

  sceneSounds = [];
  soundSourceParams = new Map();

  overlayFade = 1;
  isOverlayVisible = true;

  get isLoaded() {
    return [...this.loadedSounds.values()].every((v) => v == true);
  }

  constructor() {
    makeObservable(this, {
      painting: observable,
      loadedSounds: observable,
      soundSourceParams: observable,
      overlayFade: observable,
      isOverlayVisible: observable,
      isLoaded: computed,
    });

    this.setMouseListeners();
  }

  setMouseListeners() {
    const mouseMove = (e) => {
      const windowInnerWidth = window.innerWidth;
      const windowInnerHeight = window.innerHeight;
      this.setSoundPosition(
        e.pageX / windowInnerWidth,
        e.pageY / windowInnerHeight
      );
    };
    window.addEventListener("mousemove", mouseMove, false);
  }

  getSoundSourceParams(file) {
    return this.soundSourceParams.get(file);
  }

  setPainting(painting) {
    this.painting = painting;
    const { key, sounds } = painting;

    sounds.forEach((entry) => {
      const { file } = entry;
      if (this.players.get(file)) {
        return;
      }
      const url = `${process.env.PUBLIC_URL}/${key}/${file}`;
      const player = new Tone.Player(url, () => {
        console.log("loaded", file);
        this.loadedSounds.set(file, true);
      }).toDestination();
      this.players.set(file, player);
      player.loop = true;
      player.volume.value = DEFAULT_DECIBELS;

      this.loadedSounds.set(file, false);
    });

    this.sceneSounds = sounds;
  }

  playSounds() {
    this.sceneSounds.forEach((sound) => {
      const player = this.players.get(sound.file);
      if (player && player.state !== "started") {
        player.start();
      }
    });
  }

  async fadeOutOverlay() {
    if (this.animatedOverlay) return;

    this.animatedOverlay = new AnimatedValue({
      start: 1,
      end: 0,
    });

    await this.animatedOverlay.play(500, () => {
      this.overlayFade = this.animatedOverlay.value();
    });

    this.isOverlayVisible = false;
    this.animatedOverlay = null;
  }

  setSoundPosition(xPercent, yPercent) {
    this.sceneSounds.forEach((sound) => {
      const element = document.getElementById(sound.file);
      const [soundXPercent, soundYPercent] = sound.position;
      const { radius } = sound;
      if (element) {
        const dx = Math.abs(soundXPercent - xPercent);
        const dy = Math.abs(soundYPercent - yPercent);
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        const distancePercent = Math.min(1, distance / radius);
        const gain = 1 - distancePercent;
        const decibels = Tone.gainToDb(gain);
        const player = this.players.get(sound.file);
        this.soundSourceParams.set(sound.file, { gain });
        if (player) {
          player.volume.value = decibels + DEFAULT_DECIBELS;
        }
      }
    });
  }
}

export default new Engine();
