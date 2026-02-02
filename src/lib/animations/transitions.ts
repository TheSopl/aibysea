import { Transition } from "framer-motion";

/**
 * Reusable transition timing configurations.
 * Use these for consistent motion feel across the platform.
 */

/**
 * Spring transition with snappy feel
 * Use for: Interactive elements, buttons, toggles
 * Provides natural bouncy motion without being too elastic
 */
export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 17
};

/**
 * Ease out transition for smooth deceleration
 * Use for: General animations, fades, slides
 * Fast start, gradual slowdown
 */
export const easeOut: Transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2
};

/**
 * Smooth transition with custom cubic bezier
 * Use for: Page transitions, complex animations
 * Material Design standard easing
 */
export const smooth: Transition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.3
};

/**
 * Fast transition for instant feedback
 * Use for: Micro-interactions, hover states
 * Very quick response time
 */
export const fast: Transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15
};

/**
 * Slow transition for emphasis
 * Use for: Important state changes, confirmations
 * Longer duration for user attention
 */
export const slow: Transition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.5
};
