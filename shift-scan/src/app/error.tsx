/*
 * Global error boundary for Next.js App Router.
 * Reports errors to Sentry and displays a generic error message.
 */
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * App-level error boundary for catching unhandled errors in the App Router.
 * Reports errors to Sentry and provides a reset option.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-4">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
