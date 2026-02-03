"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-heading-2 font-bold">Something went wrong</h2>
        <Button
          variant="primary"
          onClick={reset}
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
