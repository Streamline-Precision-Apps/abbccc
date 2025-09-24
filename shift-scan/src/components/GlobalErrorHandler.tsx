"use client";

import { useEffect } from "react";

/**
 * Global Error Handler for CSS and resource loading errors
 * Prevents CSS loading errors from becoming unhandled promise rejections
 */
const GlobalErrorHandler = () => {
  useEffect(() => {
    // Handle CSS link errors before they become unhandled promise rejections
    const handleLinkError = (event: Event) => {
      const target = event.target as HTMLLinkElement;
      if (target && target.tagName === "LINK" && target.rel === "stylesheet") {
        // This is a CSS loading error - prevent it from propagating
        event.preventDefault();
        event.stopPropagation();

        // Don't log in production to avoid console spam
        if (process.env.NODE_ENV === "development") {
          console.log(
            "[GlobalErrorHandler] Suppressed CSS loading error for:",
            target.href,
          );
        }
      }
    };

    // Handle font loading errors
    const handleFontError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && (target as any).src?.includes("__nextjs_font/")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // Handle resource loading errors at the document level
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;

      // Check if it's a CSS file
      if (target && (target as any).href?.includes(".css")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Check if it's a font file
      if (target && (target as any).src?.includes(".woff")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Check if it's manifest.json
      if (target && (target as any).href?.includes("manifest.json")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    };

    // Add event listeners at the document level to catch errors early
    document.addEventListener("error", handleResourceError, true); // Use capture phase
    document.addEventListener("error", handleLinkError, true);
    document.addEventListener("error", handleFontError, true);

    return () => {
      document.removeEventListener("error", handleResourceError, true);
      document.removeEventListener("error", handleLinkError, true);
      document.removeEventListener("error", handleFontError, true);
    };
  }, []);

  return null;
};

export default GlobalErrorHandler;
