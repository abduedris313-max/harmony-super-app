/**
 * Web Audio API Ambient Music Synthesizer Engine
 */
class AmbientMusicSynth {
  private audioCtx: AudioContext | null = null;
  private currentOsc: OscillatorNode | null = null;
  private currentGain: GainNode | null = null;
  private isPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playTone(frequency: number) {
    try {
      this.stop();
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Smooth envelope attack
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.currentOsc = osc;
      this.currentGain = gain;
      this.isPlaying = true;
    } catch {
      // Audio autoplay policy guard
    }
  }

  public stop() {
    try {
      if (this.currentGain && this.audioCtx) {
        this.currentGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);
      }
      setTimeout(() => {
        if (this.currentOsc) {
          this.currentOsc.stop();
          this.currentOsc.disconnect();
          this.currentOsc = null;
        }
      }, 500);
      this.isPlaying = false;
    } catch {
      // Graceful teardown
    }
  }
}

export const ambientMusicSynth = new AmbientMusicSynth();
