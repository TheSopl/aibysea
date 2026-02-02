import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6538c5aedeb777335c068fb5387c8e32@o4510813967220736.ingest.de.sentry.io/4510813969383504",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Session Replay
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  replaysSessionSampleRate: 0.1, // 10% of all sessions

  // Capture logs
  enableLogs: true,

  // Ignore common false positives
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
