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
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
    >
      {children}
    </motion.div>
  );
}
