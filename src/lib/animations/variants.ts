import { Variants } from "framer-motion";

/**
 * Reusable animation variants for consistent motion across the platform.
 * All animations are fast (150-300ms) and respect accessibility preferences.
 */

/**
 * Fade in animation with optional y offset
 * Use for: General content reveals, modals, tooltips
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};

/**
 * Fade in with y offset (upward reveal)
 * Use for: Cards, list items, scroll-based reveals
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
};

/**
 * Slide in from direction with fade
 * Use for: Drawers, side panels, notifications
 */
export const slideIn = {
  left: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  },
  right: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  },
  up: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  },
  down: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  }
} as const;

/**
 * Scale up with fade (subtle zoom effect)
 * Use for: Modals, popovers, cards on hover
 */
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};

/**
 * Stagger container for sequential animations
 * Use for: Lists, grids, sequential content reveals
 * Pair with staggerItem variant on children
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

/**
 * Stagger item (used with staggerContainer)
 * Use for: Individual items in animated lists
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};
