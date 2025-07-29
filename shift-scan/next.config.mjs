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
