import * as Tone from "tone";
import { makeObservable, observable, computed } from "mobx";

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
      player.volume.value = -12;

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

  setSoundPosition(x, y) {
    // console.log(x, y);
  }
}

export default new AudioPlayer();
