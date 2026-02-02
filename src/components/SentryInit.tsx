"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

let isInitialized = false;

export function SentryInit() {
  useEffect(() => {
    if (!isInitialized && typeof window !== "undefined") {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://6538c5aedeb777335c068fb5387c8e32@o4510813967220736.ingest.de.sentry.io/4510813969383504",
        tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
        debug: false,
        replaysOnErrorSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        enableLogs: true,
        ignoreErrors: [
          "ResizeObserver loop limit exceeded",
          "ResizeObserver loop completed with undelivered notifications",
          "Non-Error promise rejection captured",
        ],
        integrations: [
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
      });
      isInitialized = true;
      console.log("✓ Sentry initialized on client");
    }
  }, []);

  return null;
}
