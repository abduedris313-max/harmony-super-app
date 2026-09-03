/**
 * Web Audio API Mechanical Typewriter Sound Synthesizer
 * Delegates to centralized soundManager to respect Focus Mode muting and volume control.
 */
import { soundManager } from '../../../lib/soundManager';

class TypewriterSoundEngine {
  public playKeyClick() {
    soundManager.playTypewriterClick();
  }

  public playSpaceKey() {
    soundManager.playTypewriterSpace();
  }
}

export const typewriterSound = new TypewriterSoundEngine();

