import * as Tone from "tone";
import AnimatedValue from "animated-value";
import { makeObservable, observable, computed } from "mobx";

const DEFAULT_DECIBELS = -12;

class Engine {
  painting = null;

  loadedSounds = new Map();
  players = new Map();
  meters = new Map();

  soundSourceLevels = new Map();
  soundSourceRipples = new Map();

  overlayFade = 1;
  isOverlayVisible = true;

  get isLoaded() {
    return [...this.loadedSounds.values()].every((v) => v == true);
  }

  constructor() {
    makeObservable(this, {
      painting: observable,
      loadedSounds: observable,
      soundSourceLevels: observable,
      soundSourceRipples: observable,
      overlayFade: observable,
      isOverlayVisible: observable,
      isLoaded: computed,
    });

    this.setMouseListeners();

    requestAnimationFrame(() => {
      this.animateSoundSources();
    });
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

  setPainting(painting) {
    this.painting = painting;
    const { key, sounds } = painting;

    sounds.forEach((entry) => {
      const { file } = entry;
      if (this.players.get(file)) {
        return;
      }
      const url = `${process.env.PUBLIC_URL}/paintings/${key}/${file}`;

      const player = new Tone.Player(url, () => {
        console.log("loaded", file);
        this.loadedSounds.set(file, true);

        // Compute the RMS for the data
        const buffer = player.buffer.getChannelData(0);
        const FRAME_SIZE = 2048;
        let maxRms = 0;
        let totalSum = 0;
        for (let i = 0; i < buffer.length; i += FRAME_SIZE) {
          let sum = 0;
          const end = Math.min(buffer.length, i + FRAME_SIZE);
          for (let j = i; j < end; j++) {
            sum += buffer[j] ** 2;
            totalSum += buffer[j] ** 2;
          }
          const rms = Math.sqrt((1 / FRAME_SIZE) * sum);
          maxRms = Math.max(rms, maxRms);
        }
        const totalRms = Math.sqrt((1 / buffer.length) * totalSum);
        const avgDecibel = 20 * (Math.log(totalRms) / Math.log(10));
        const maxDecibel = 20 * (Math.log(maxRms) / Math.log(10));
        console.log(
          `avg: ${avgDecibel.toFixed(2)}db, max: ${maxDecibel.toFixed(2)}db`
        );
      });

      this.players.set(file, player);
      player.loop = true;

      const adjustVolume = entry.volume === undefined ? 0 : entry.volume;
      const volume = new Tone.Volume(
        DEFAULT_DECIBELS + adjustVolume
      ).toDestination();
      player.connect(volume);

      const meter = new Tone.Meter(0.1);
      volume.connect(meter);
      this.meters.set(file, meter);

      this.loadedSounds.set(file, false);
    });
  }

  animateSoundSources = () => {
    for (const entry of this.meters.entries()) {
      const [file, meter] = entry;
      const gain = Tone.dbToGain(meter.getValue());
      this.soundSourceRipples.set(file, gain);
    }

    requestAnimationFrame(() => {
      this.animateSoundSources();
    });
  };

  async playSounds() {
    await Tone.start();
    this.painting.sounds.forEach((sound) => {
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
    this.painting.sounds.forEach((sound) => {
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
        this.soundSourceLevels.set(sound.file, gain);
        if (player) {
          player.volume.value = decibels + DEFAULT_DECIBELS;
        }
      }
    });
  }
}

export default new Engine();
