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
      // App routes and API
      {
        urlPattern: /^https?:\/\/.*/, // All HTTP(S) requests
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
      // Dynamic JS chunks (Next.js)
      {
        urlPattern: /^\/(_next\/static\/chunks\/.*\.js)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "js-chunks",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          },
        },
      },
      // Worker scripts (e.g. qr-scanner)
      {
        urlPattern: /^\/(_next\/static\/chunks\/.*worker.*\.js)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "worker-js",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          },
        },
      },
      // Fonts
      {
        urlPattern: /^\/(__nextjs_font\/.*\.woff2)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "fonts",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
      // SVGs
      {
        urlPattern: /^\/.*\.svg$/,
        handler: "CacheFirst",
        options: {
          cacheName: "svg-assets",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
      // CSS
      {
        urlPattern: /^\/(_next\/static\/css\/.*\.css)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "css-assets",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ["!camera.js"],
};

const nextConfig = {
  // experimental: {
  //   //   serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  // },
};

// Apply plugins in the correct order:
// 1. next-intl → 2. PWA → 3. Sentry
const combinedConfig = withPWA(pwaConfig)(withNextIntl(nextConfig));

// Export the final config with Sentry
export default withSentryConfig(combinedConfig, {
  org: "walksean06",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring", // Proxy route (optional)
  disableLogger: true, // Reduces bundle size
  automaticVercelMonitors: true, // For Vercel Cron Jobs
});
