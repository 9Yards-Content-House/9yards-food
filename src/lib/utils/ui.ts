/**
 * Triggers a haptic feedback vibration on supported devices.
 * @param pattern Pattern of vibration in ms. Default is 50ms (light tap).
 */
export const vibrate = (pattern: number | number[] = 50) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

/**
 * Haptic feedback presets for common actions
 */
export const haptics = {
  /** Light tap - button presses, toggles */
  light: () => vibrate(10),
  
  /** Medium tap - confirmations, selections */
  medium: () => vibrate(25),
  
  /** Heavy tap - important actions */
  heavy: () => vibrate(50),
  
  /** Success pattern - task completed */
  success: () => vibrate([50, 30, 50]),
  
  /** Warning pattern - attention needed */
  warning: () => vibrate([30, 50, 30]),
  
  /** Error pattern - action failed */
  error: () => vibrate([100, 50, 100]),
  
  /** Selection changed */
  selection: () => vibrate(15),
  
  /** Swipe threshold crossed */
  threshold: () => vibrate(30),
  
  /** Pull to refresh triggered */
  refresh: () => vibrate([20, 40, 20]),
};

/**
 * Check if device supports haptic feedback
 */
export const supportsHaptics = () => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Check if device is mobile/tablet based on screen width and touch capability
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 1024; // lg breakpoint
  
  return isTouchDevice && isSmallScreen;
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
