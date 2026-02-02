"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition wrapper for smooth route changes.
 *
 * Wraps page content with a fade-in animation that triggers on mount.
 * Respects user's prefers-reduced-motion setting for accessibility.
 *
 * Usage:
 * ```tsx
 * export default function Page() {
 *   return (
 *     <PageTransition>
 *       <YourPageContent />
 *     </PageTransition>
 *   );
 * }
 * ```
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check user's motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // If user prefers reduced motion, return children without animation
  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: "tween",
        ease: "easeOut",
        duration: 0.3
      }}
    >
      {children}
    </motion.div>
  );
}
