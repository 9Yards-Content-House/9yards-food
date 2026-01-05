
/**
 * Triggers a haptic feedback vibration on supported devices.
 * @param pattern Pattern of vibration in ms. Default is 50ms (light tap).
 */
export const vibrate = (pattern: number | number[] = 50) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};
