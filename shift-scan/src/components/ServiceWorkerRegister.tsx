/**
 * Client-only component to register the service worker for offline support.
 */
"use client";
import { useEffect } from "react";
import { useServiceWorker } from "../hooks/useServiceWorker";

const ServiceWorkerRegister = () => {
  useServiceWorker();

  // Handle unhandled promise rejections globally
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;

      // Check if it's a CSS/font loading error (Event object from <link> tags)
      const isCSSOrFontError =
        error instanceof Event &&
        (error.target instanceof HTMLLinkElement || error.type === "error");

      // Check if it's a network-related error
      const isNetworkError =
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("ERR_INTERNET_DISCONNECTED") ||
        error?.message?.includes("net::ERR_FAILED") ||
        error?.message?.includes("net::ERR_") ||
        error?.code === "NETWORK_ERROR" ||
        (typeof error === "string" && error.includes("net::ERR_"));

      // Check if it's a Sentry/monitoring error - more comprehensive check
      const isSentryError =
        error?.message?.includes("monitoring") ||
        error?.__sentry_captured__ === true ||
        (typeof error === "string" && error.includes("monitoring")) ||
        event.reason?.stack?.includes("sentry") ||
        event.reason?.stack?.includes("monitoring");

      // Check if it's a webpack/Next.js hot reload error
      const isDevError =
        error?.message?.includes("webpack-hmr") ||
        error?.message?.includes("turbopack-hmr") ||
        error?.message?.includes("__nextjs_original-stack-frames");

      // Check if it's a preload CSS warning (not an actual error)
      const isPreloadWarning = error?.message?.includes(
        "preloaded using link preload but not used",
      );

      // Suppress all these types of errors during offline mode
      if (
        isCSSOrFontError ||
        isNetworkError ||
        isSentryError ||
        isDevError ||
        isPreloadWarning
      ) {
        // Completely suppress these expected offline errors
        event.preventDefault();
        return;
      }

      // Only log meaningful errors that aren't related to offline mode
      if (error && typeof error === "object" && error.message) {
        console.warn("[ServiceWorkerRegister] Unhandled promise rejection:", {
          message: error.message,
          type: error.constructor?.name || typeof error,
        });
      }

      event.preventDefault();
    };

    // Also handle regular error events
    const handleError = (event: ErrorEvent) => {
      const isNetworkError =
        event.message?.includes("Failed to fetch") ||
        event.message?.includes("ERR_INTERNET_DISCONNECTED") ||
        event.message?.includes("net::ERR_") ||
        event.message?.includes("monitoring");

      if (isNetworkError) {
        // Suppress network-related errors
        event.preventDefault();
        return;
      }
    };

    // Add the event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    // Cleanup
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
};

export default ServiceWorkerRegister;
