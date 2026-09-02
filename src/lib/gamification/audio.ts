/**
 * Zero-dependency synth SFX for the System HUD - plain Web Audio oscillators
 * with a short gain envelope, no audio files. A single lazily-created
 * AudioContext is reused across calls; browsers require a user gesture
 * before it can produce sound, so `unlock()` should run on the first click.
 */
class SystemAudio {
  private ctx: AudioContext | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!this.ctx) this.ctx = new Ctor();
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private tone(freq: number, startOffset: number, duration: number, type: OscillatorType, peakGain: number) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const start = ctx.currentTime + startOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  /** Unlocks the AudioContext - call on the first user interaction. */
  unlock() {
    this.ensureContext();
  }

  click() {
    this.tone(920, 0, 0.05, "square", 0.05);
  }

  toggle() {
    this.tone(700, 0, 0.06, "triangle", 0.07);
  }

  questComplete() {
    this.tone(660, 0, 0.09, "sine", 0.13);
    this.tone(990, 0.06, 0.14, "sine", 0.11);
  }

  levelUp() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => this.tone(freq, i * 0.09, 0.28, "triangle", 0.15));
  }

  titleUnlock() {
    [440, 554.37, 659.25].forEach((freq, i) => this.tone(freq, i * 0.11, 0.32, "sine", 0.12));
  }

  penaltyAlarm() {
    for (let i = 0; i < 4; i++) this.tone(220 + (i % 2) * 140, i * 0.18, 0.16, "sawtooth", 0.17);
  }
}

export const systemAudio = new SystemAudio();
