import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";

const AutoPermissionsManager = dynamic(
  () => import("@/components/(settings)/AutoPermissionsManager"),
  { ssr: false }
);

export const viewport: Viewport = {
  themeColor: "#57BDE9",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shift Scan",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
  title: { default: "Shift Scan", template: "%s | Shift Scan" },
  description: "Time Cards made easier",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-full">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#57BDE9" />
      </head>
      <body className="min-h-screen overflow-auto  bg-gradient-to-b from-app-dark-blue to-app-blue">
        <main className="min-h-screen overflow-auto bg-gradient-to-b from-app-dark-blue to-app-blue">
          <NextIntlClientProvider messages={messages}>
            <Providers>
              {children}
              <SpeedInsights />
              <AutoPermissionsManager />
            </Providers>
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
