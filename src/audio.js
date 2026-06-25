class AudioManager {
  constructor() {
    this.ctx = null;
    this.bgm = null;
    this.musicMuted = false;
    this.sfxMuted = false;
  }

  init() {
    if (this.ctx) return;
    // Initialize AudioContext lazily on user gesture
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.bgm = new Audio("/assest/music/music.mp3");
    this.bgm.loop = true;
    this.bgm.volume = 0.05;
    if (!this.musicMuted) {
      this.bgm
        .play()
        .catch((e) => console.log("BGM play deferred until interaction:", e));
    }
  }

  toggleMusicMute() {
    this.musicMuted = !this.musicMuted;
    if (this.bgm) {
      if (this.musicMuted) {
        this.bgm.pause();
      } else {
        this.bgm.play().catch((e) => console.log("BGM resume error:", e));
      }
    }
    return this.musicMuted;
  }

  toggleSfxMute() {
    this.sfxMuted = !this.sfxMuted;
    return this.sfxMuted;
  }

  playFlip() {
    this.init();
    if (this.sfxMuted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playMatch() {
    this.init();
    if (this.sfxMuted || !this.ctx) return;

    const playTone = (freq, delay, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(
        0.25,
        this.ctx.currentTime + delay + 0.02,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + delay + duration,
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    };

    // Satisfying two-tone ascending match chord
    playTone(523.25, 0, 0.2); // C5
    playTone(659.25, 0.08, 0.25); // E5
  }

  playFail() {
    this.init();
    if (this.sfxMuted || !this.ctx) return;

    const playTone = (
      freq,
      delay,
      duration,
      type = "sawtooth",
      endFreq = null,
    ) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      if (endFreq) {
        osc.frequency.linearRampToValueAtTime(
          endFreq,
          this.ctx.currentTime + delay + duration,
        );
      }

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, this.ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(
        0.14,
        this.ctx.currentTime + delay + 0.03,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + delay + duration,
      );

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    };

    // Dramatic, descending minor chords for defeat (G minor triad slide)
    playTone(196.0, 0.0, 0.6, "sawtooth", 146.83); // G3 -> D3
    playTone(233.08, 0.15, 0.6, "sawtooth", 174.61); // Bb3 -> F3
    playTone(293.66, 0.3, 0.8, "sawtooth", 220.0); // D4 -> A3
  }

  playVictory() {
    this.init();
    if (this.sfxMuted || !this.ctx) return;

    const playTone = (freq, delay, duration, type = "sine", volume = 0.12) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      // Pitch vibrato for richer chorus effect
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.value = 6; // 6Hz frequency modulation
      vibratoGain.gain.value = freq * 0.015; // Depth of pitch bend
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(
        volume,
        this.ctx.currentTime + delay + 0.05,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + delay + duration,
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      vibrato.start(this.ctx.currentTime + delay);
      osc.start(this.ctx.currentTime + delay);

      vibrato.stop(this.ctx.currentTime + delay + duration);
      osc.stop(this.ctx.currentTime + delay + duration);
    };

    // Triumphant Fanfare Arpeggio with harmony (C Major Progression)
    playTone(261.63, 0.0, 0.8, "triangle", 0.1); // Bass C4
    playTone(392.0, 0.1, 0.8, "sine", 0.08); // G4
    playTone(523.25, 0.2, 0.8, "sine", 0.08); // C5
    playTone(659.25, 0.3, 0.8, "sine", 0.08); // E5
    playTone(783.99, 0.4, 0.8, "sine", 0.08); // G5
    playTone(1046.5, 0.5, 1.2, "sine", 0.1); // High C6
    playTone(1318.51, 0.6, 1.0, "sine", 0.06); // E6
  }
}

export const audio = new AudioManager();
