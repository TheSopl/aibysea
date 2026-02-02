"use client";

import { motion, useAnimation } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  threshold?: number;
}

/**
 * FadeIn component for scroll-based reveal animations.
 *
 * Uses Intersection Observer to trigger animation when element enters viewport.
 * Animates only once (triggerOnce pattern) for performance.
 * Respects user's prefers-reduced-motion setting for accessibility.
 *
 * Usage:
 * ```tsx
 * <FadeIn delay={0.2} threshold={0.1}>
 *   <YourContent />
 * </FadeIn>
 * ```
 *
 * @param delay - Optional delay before animation starts (in seconds)
 * @param threshold - Percentage of element that must be visible to trigger (0-1, default 0.1)
 */
export default function FadeIn({
  children,
  delay = 0,
  threshold = 0.1
}: FadeInProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
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

  useEffect(() => {
    // Skip if already animated or user prefers reduced motion
    if (hasAnimated || shouldReduceMotion) return;

    const element = ref.current;
    if (!element) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          controls.start("visible");
          setHasAnimated(true);
        }
      },
      {
        threshold,
        rootMargin: "0px"
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [controls, hasAnimated, threshold, shouldReduceMotion]);

  // If user prefers reduced motion, return children without animation
  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
            delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}
