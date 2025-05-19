import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  themeColor: "#57BDE9",
};

export const metadata: Metadata = {
  title: { default: "Shift Scan", template: "%s | Shift Scan" },
  description: "Time Cards made easier",
  manifest: "/manifest.json",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-screen overflow-auto">
        <main className="min-h-screen overflow-auto">
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

