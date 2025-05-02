import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  themeColor: "#57BDE9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  minimumScale: 1,
};

export const metadata: Metadata = {
  title: { default: "Shift Scan", template: "%s | Shift Scan" },
  description: "Time Cards made easier",
  manifest: "/manifest.json",
  themeColor: "#57BDE9",
  viewport,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <main>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              {children}
              <SpeedInsights />
            </Providers>
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
