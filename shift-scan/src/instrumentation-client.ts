// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9077502936b7ff3107eb72d86f93e00a@o4510041612419072.ingest.us.sentry.io/4510041616613376",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Skip sending events when offline to reduce network errors
  beforeSend(event, hint) {
    if (!navigator.onLine) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Sentry] Skipping event while offline:', event.message || event.exception);
      }
      return null;
    }
    return event;
  },

  // Handle transport errors gracefully (like when offline)
  transport: undefined, // Use default transport but with custom error handling

  // Reduce network noise in development
  maxBreadcrumbs: process.env.NODE_ENV === 'development' ? 10 : 100,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
