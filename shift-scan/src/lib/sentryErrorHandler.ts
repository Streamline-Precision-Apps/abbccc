/**
 * Utility for reporting errors to Sentry in non-API/server files.
 * Use in services, utils, or anywhere outside API routes/components.
 */
import * as Sentry from '@sentry/nextjs';

/**
 * Reports an error to Sentry and logs it to the console.
 * @param error - The error to report
 * @param context - Optional context for Sentry
 */
export const reportError = (error: unknown, context?: Record<string, unknown>): void => {
  Sentry.captureException(error, context ? { extra: context } : undefined);
  // eslint-disable-next-line no-console
  console.error('Reported to Sentry:', error, context);
};
