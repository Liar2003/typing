/**
 * Procedural Web Audio API sound synthesizer
 * Zero external audio files, ultra-low latency, futuristic keyboard mechanics
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Mechanical Cyber Key Click
   * Synthesizes mechanical switch leaf snap + plastic keycap bottoming out
   */
  public playKeyClick(isSpace = false) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseGain = this.ctx.createGain();
      baseGain.gain.setValueAtTime(this.volume * (isSpace ? 0.35 : 0.25), now);
      baseGain.connect(this.ctx.destination);

      // 1. High crisp click (metallic contact)
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      const pitch = isSpace ? 1800 : 2800 + Math.random() * 400;
      clickOsc.frequency.setValueAtTime(pitch, now);
      clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.015);

      clickGain.gain.setValueAtTime(0.7, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      clickOsc.connect(clickGain);
      clickGain.connect(baseGain);

      clickOsc.start(now);
      clickOsc.stop(now + 0.025);

      // 2. Body thud (keycap bottoming out)
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(isSpace ? 110 : 220, now);
      thudOsc.frequency.exponentialRampToValueAtTime(60, now + 0.04);

      thudGain.gain.setValueAtTime(0.8, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      thudOsc.connect(thudGain);
      thudGain.connect(baseGain);

      thudOsc.start(now);
      thudOsc.stop(now + 0.055);
    } catch {
      // Audio error suppressed
    }
  }

  /**
   * Holographic Error Sound (cyber glitch pulse)
   */
  public playError() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.connect(this.ctx.destination);

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(110, now + 0.04);
      osc.frequency.setValueAtTime(90, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio error suppressed
    }
  }

  /**
   * Futuristic level/test completion chord
   */
  public playCompletion() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      chords.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.65);
      });
    } catch {
      // Audio error suppressed
    }
  }
}

export const soundEngine = new SoundEngine();
