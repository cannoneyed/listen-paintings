import * as Tone from "tone";
import { makeObservable, observable, computed } from "mobx";

const DEFAULT_DECIBELS = -12;

class AudioPlayer {
  players = new Map();
  loadedSounds = new Map();
  sceneSounds = [];

  get isLoaded() {
    return [...this.loadedSounds.values()].every((v) => v == true);
  }

  constructor(value) {
    makeObservable(this, {
      loadedSounds: observable,
      isLoaded: computed,
    });
    this.value = value;
  }

  setSounds(key, sounds) {
    sounds.forEach((entry) => {
      const { file } = entry;
      if (this.players.get(file)) {
        return;
      }
      const url = `${key}/${file}`;
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
        this.setSoundPosition(0, 0);
      }
    });
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
        if (player) {
          const MIN_OPACITY = 0.5;
          const MIN_SIZE = 40;
          const MAX_SIZE = 80;
          const opacity = gain * (1 - MIN_OPACITY) + MIN_OPACITY;
          const size = gain * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
          element.style.opacity = opacity;
          element.style.width = `${size}px`;
          element.style.height = `${size}px`;
          element.style.marginLeft = `${-size / 2}px`;
          element.style.marginTop = `${-size / 2}px`;
          player.volume.value = decibels + DEFAULT_DECIBELS;
        }
      }
    });
  }
}

export default new AudioPlayer();
