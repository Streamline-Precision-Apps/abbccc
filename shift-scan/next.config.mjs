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
  // publicExcludes: ["!camera.js"], //ask sean about this
};

const nextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/fcm-shift-scan.firebasestorage.app/o/**",
      },
    ],
  },
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
