"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryTestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold">Sentry Error Test</h1>
      <p className="mb-8 text-gray-600">Click the button below to test error tracking:</p>
      <button
        type="button"
        className="rounded bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
        onClick={() => {
          throw new Error("Sentry Test Error from Frontend");
        }}
      >
        Throw test error
      </button>
    </div>
  );
}
