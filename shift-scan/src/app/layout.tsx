import * as Sentry from "@sentry/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import OfflineCSSFallback from "../components/OfflineCSSFallback";
import CSSDebugger from "../components/CSSDebugger";
import OfflineStatusManager from "../components/OfflineStatusManager";
import OfflineSyncStatus from "../components/OfflineSyncStatus";
import GlobalErrorHandler from "../components/GlobalErrorHandler";
import "@/app/globals.css";
import AutoPermissionsManager from "@/components/(settings)/AutoPermissionsManager";

export const viewport: Viewport = {
  themeColor: "#57BDE9",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const traceData = Sentry.getTraceData(); // Get Sentry trace data

  return {
    title: { default: "Shift Scan", template: "%s | Shift Scan" },
    description: "Time Cards made easier",
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Shift Scan",
    },
    formatDetection: {
      telephone: false,
      date: false,
      email: false,
      address: false,
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "mobile-web-app-capable": "yes",
      ...traceData, // Merge Sentry trace data
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-full">
      <body suppressHydrationWarning>
        <main className="min-h-screen overflow-auto bg-gradient-to-b from-app-dark-blue to-app-blue">
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <ErrorBoundary>{children}</ErrorBoundary>
              <SpeedInsights />
              <AutoPermissionsManager />
              {/* Global error handler for CSS and resource loading */}
              <GlobalErrorHandler />
              {/* Register service worker for offline support */}
              <ServiceWorkerRegister />
              {/* Ensure CSS fallback is available when offline */}
              <OfflineCSSFallback />
              {/* CSS debugger for development (Ctrl+Shift+D to toggle) */}
              <CSSDebugger />
              {/* Offline status and caching manager */}
              <OfflineStatusManager />
              {/* Offline sync status indicator */}
              <OfflineSyncStatus />
            </Providers>
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
