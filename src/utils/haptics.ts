/**
 * @file haptics.ts
 * @description iOS-style Haptic Feedback Utility leveraging navigator.vibrate()
 * Provides tactile feedback for buttons, app launches, swipe gestures, and system actions.
 */

export const HapticPattern = {
  light: 10,         // subtle tap (button click, toggle switch)
  medium: 18,        // firm tap (app launch, spotlight open)
  heavy: 32,         // strong tap (long press edit mode, delete)
  selection: 8,      // light tick (tab change, menu item hover)
  swipe: 15,         // swipe gesture threshold reached
  dismiss: 28,       // swipe-up to close app gesture
  success: [12, 40, 18], // success feedback pulse
  warning: [20, 50, 20],
  error: [25, 60, 25, 60, 30]
} as const;

export type HapticType = keyof typeof HapticPattern;

/**
 * Triggers tactile vibration feedback mimicking iOS Taptic Engine behavior.
 */
export function triggerHaptic(type: HapticType | number | number[] = 'light'): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  if (!('vibrate' in navigator)) {
    return false;
  }

  try {
    let pattern: number | number[];
    if (typeof type === 'string' && type in HapticPattern) {
      const val = HapticPattern[type as HapticType];
      pattern = Array.isArray(val) ? Array.from(val) : (val as number);
    } else if (typeof type === 'number' || Array.isArray(type)) {
      pattern = type;
    } else {
      pattern = HapticPattern.light;
    }
    return navigator.vibrate(pattern);
  } catch (err) {
    // Vibration may be blocked by user settings or permissions
    console.debug('[Haptics] Vibration trigger ignored:', err);
    return false;
  }
}
