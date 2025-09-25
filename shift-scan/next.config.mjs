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
  },
  buildExcludes: [/middleware-manifest\.json$/],
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
};

// Apply plugins in the correct order:
// 1. next-intl → 2. PWA → 3. Sentry
const combinedConfig = withPWA(pwaConfig)(withNextIntl(nextConfig));

export default withSentryConfig(combinedConfig, {
  org: "streamline-precision-llc-el",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring", // Proxy route (optional)
  disableLogger: true, // Reduces bundle size
  automaticVercelMonitors: true, // For Vercel Cron Jobs
  telemetry: false, // Opts out of Sentry telemetry
});
