/**
 * Mobile & Device Responsive Utilities
 * Helps create responsive layouts that work on all devices
 */

export const DEVICE_BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  ultrawide: 1920,
};

export type DeviceType = "mobile" | "tablet" | "laptop" | "desktop" | "ultrawide";

/**
 * Get current device type based on window width
 */
export const getDeviceType = (): DeviceType => {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  if (width <= DEVICE_BREAKPOINTS.mobile) return "mobile";
  if (width <= DEVICE_BREAKPOINTS.tablet) return "tablet";
  if (width <= DEVICE_BREAKPOINTS.laptop) return "laptop";
  if (width <= DEVICE_BREAKPOINTS.desktop) return "desktop";
  return "ultrawide";
};

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= DEVICE_BREAKPOINTS.mobile;
};

/**
 * Check if device is touch-capable
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};

/**
 * Check if device is in landscape mode
 */
export const isLandscape = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerHeight < window.innerWidth;
};

/**
 * Get optimal animation intensity based on device
 */
export const getOptimalAnimationIntensity = (): "low" | "medium" | "high" => {
  const device = getDeviceType();
  
  // Lower animation intensity on mobile for performance
  if (device === "mobile" || device === "tablet") {
    return "medium";
  }
  return "high";
};

/**
 * Get optimal particle count based on device performance
 */
export const getOptimalParticleCount = (): number => {
  const device = getDeviceType();
  
  switch (device) {
    case "mobile":
      return 10;
    case "tablet":
      return 15;
    case "laptop":
      return 25;
    case "desktop":
      return 40;
    case "ultrawide":
      return 60;
    default:
      return 25;
  }
};

/**
 * Get optimal font size multiplier for different devices
 */
export const getFontSizeMultiplier = (): number => {
  const device = getDeviceType();
  
  switch (device) {
    case "mobile":
      return 0.85;
    case "tablet":
      return 0.95;
    case "laptop":
      return 1;
    case "desktop":
      return 1.1;
    case "ultrawide":
      return 1.2;
    default:
      return 1;
  }
};

/**
 * Responsive font size generator
 */
export const generateResponsiveFontSize = (baseSize: number): string => {
  const multiplier = getFontSizeMultiplier();
  return `${baseSize * multiplier}px`;
};

/**
 * Check if reduced motion preference is enabled
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get animation duration based on reduced motion preference
 */
export const getAnimationDuration = (normalDuration: number): number => {
  return prefersReducedMotion() ? normalDuration * 0.5 : normalDuration;
};

/**
 * Responsive spacing calculator
 */
export const getResponsiveSpacing = (baseSpacing: number): number => {
  const device = getDeviceType();
  
  switch (device) {
    case "mobile":
      return baseSpacing * 0.75;
    case "tablet":
      return baseSpacing * 0.875;
    default:
      return baseSpacing;
  }
};

/**
 * Get optimal container width
 */
export const getOptimalContainerWidth = (): string => {
  const device = getDeviceType();
  
  switch (device) {
    case "mobile":
      return "100%";
    case "tablet":
      return "90%";
    case "laptop":
      return "85%";
    case "desktop":
      return "80%";
    case "ultrawide":
      return "75%";
    default:
      return "85%";
  }
};

/**
 * Responsive grid columns
 */
export const getResponsiveGridColumns = (): number => {
  const device = getDeviceType();
  
  switch (device) {
    case "mobile":
      return 1;
    case "tablet":
      return 2;
    case "laptop":
      return 3;
    case "desktop":
      return 4;
    case "ultrawide":
      return 5;
    default:
      return 3;
  }
};
