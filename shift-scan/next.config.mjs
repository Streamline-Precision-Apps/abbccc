import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin();

const pwaConfig = {
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,

  swcMinify: true,
  disable: process.env.NODE_ENV === "production",
  workboxOptions: {
    disableDevLogs: true,
  },
};

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"], // replace bcryptjs with zod if needed
  },
};

export default withPWA(pwaConfig)(withNextIntl(nextConfig));
