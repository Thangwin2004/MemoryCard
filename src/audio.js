class AudioManager {
  constructor() {
    this.ctx = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.bgm = null;
    this.musicMuted = false;
    this.sfxMuted = false;
    this.initialized = false;

    // Global mobile audio unlocker
    const unlockAudio = () => {
      if (!this.initialized) this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      if (this.bgm && this.bgm.paused && !this.musicMuted) {
        this.bgm.play().catch(() => {});
      }
      document.removeEventListener("pointerdown", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("pointerdown", unlockAudio, { once: true });
    document.addEventListener("touchstart", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);

        // Mute states
        this.bgmGain.gain.value = this.musicMuted ? 0 : 1;
        this.sfxGain.gain.value = this.sfxMuted ? 0 : 1;
      }

      this.bgm = new Audio("/assest/music/music.mp3");
      this.bgm.loop = true;
      if (this.ctx && this.bgmGain) {
        const source = this.ctx.createMediaElementSource(this.bgm);
        const localGain = this.ctx.createGain();
        localGain.gain.value = 0.05; // 0.05 is the volume setting for BGM
        source.connect(localGain);
        localGain.connect(this.bgmGain);
      } else {
        this.bgm.volume = 0.05;
      }

      if (this.bgm && this.ctx) {
        this.ctx.resume().then(() => {
          this.bgm.play().catch((e) => console.log("BGM play deferred:", e));
        });
      } else if (this.bgm) {
        this.bgm.play().catch((e) => console.log("BGM play deferred:", e));
      }
    } catch (e) {
      console.warn("Audio initialization deferred/failed:", e);
    }
  }

  syncMuteState() {
    if (this.ctx) {
      this.bgmGain.gain.value = this.musicMuted ? 0 : 1;
    }

    if (this.bgm && !this.musicMuted) {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.bgm.play().catch((e) => console.log("BGM resume error:", e));
    }
  }

  toggleMusicMute() {
    this.musicMuted = !this.musicMuted;
    this.syncMuteState();
    return this.musicMuted;
  }

  toggleSfxMute() {
    this.sfxMuted = !this.sfxMuted;
    if (this.ctx) {
      this.sfxGain.gain.value = this.sfxMuted ? 0 : 1;
    }
    return this.sfxMuted;
  }

  playFlip() {
    if (!this.initialized) this.init();
    if (this.sfxMuted || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playMatch() {
    if (!this.initialized) this.init();
    if (this.sfxMuted || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

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
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    };

    // Satisfying two-tone ascending match chord
    playTone(523.25, 0, 0.2); // C5
    playTone(659.25, 0.08, 0.25); // E5
  }

  playFail() {
    if (!this.initialized) this.init();
    if (this.sfxMuted || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

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
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    };

    // Dramatic, descending minor chords for defeat (G minor triad slide)
    playTone(196.0, 0.0, 0.6, "sawtooth", 146.83); // G3 -> D3
    playTone(233.08, 0.15, 0.6, "sawtooth", 174.61); // Bb3 -> F3
    playTone(293.66, 0.3, 0.8, "sawtooth", 220.0); // D4 -> A3
  }

  playVictory() {
    if (!this.initialized) this.init();
    if (this.sfxMuted || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

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
      gain.connect(this.sfxGain);

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
