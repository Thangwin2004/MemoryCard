class AudioManager {
  constructor() {
    this.ctx = null;
    this.bgm = null;
    this.isMuted = false;
  }

  init() {
    if (this.ctx) return;
    // Initialize AudioContext lazily on user gesture
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.bgm = new Audio("/assest/music/music.mp3");
    this.bgm.loop = true;
    this.bgm.volume = 0.05;
    if (!this.isMuted) {
      this.bgm
        .play()
        .catch((e) => console.log("BGM play deferred until interaction:", e));
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgm) {
      if (this.isMuted) {
        this.bgm.pause();
      } else {
        this.bgm.play().catch((e) => console.log("BGM resume error:", e));
      }
    }
    return this.isMuted;
  }

  playFlip() {
    this.init();
    if (this.isMuted || !this.ctx) return;

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
    if (this.isMuted || !this.ctx) return;

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
    if (this.isMuted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.3);

    // Apply lowpass filter to make it sound smoother and less harsh
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playVictory() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const playTone = (freq, delay, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(
        0.22,
        this.ctx.currentTime + delay + 0.05,
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

    // Major chord arpeggio for victory!
    playTone(523.25, 0, 0.25); // C5
    playTone(659.25, 0.1, 0.25); // E5
    playTone(783.99, 0.2, 0.25); // G5
    playTone(1046.5, 0.3, 0.5); // C6
  }
}

export const audio = new AudioManager();
