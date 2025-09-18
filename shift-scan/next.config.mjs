import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const pwaConfig = {
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
    ],
  },
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ["!camera.js"],
};

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/fcm-shift-scan.firebasestorage.app/o/**",
      },
    ],
  },

  // Fix for web-push and other Node.js-only modules
  webpack: (config, { isServer }) => {
    // Only include web-push in server-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Node.js modules that should be ignored in client-side code
        net: false,
        tls: false,
        fs: false,
        http: false,
        https: false,
        crypto: false,
        // Make sure web-push is only used on the server
        "web-push": false,
      };
    }

    return config;
  },
};

// Apply plugins in the correct order:
// 1. next-intl → 2. PWA → 3. Sentry
const combinedConfig = withPWA(pwaConfig)(withNextIntl(nextConfig));

// Export the final config with Sentry
export default withSentryConfig(withSentryConfig(combinedConfig, {
  org: "streamline-precision-llc-el",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring", // Proxy route (optional)
  disableLogger: true, // Reduces bundle size
  automaticVercelMonitors: true, // For Vercel Cron Jobs
}), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "streamline-precision-llc-el",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});