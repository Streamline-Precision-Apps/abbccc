// app/personnel/[url]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";
import { Providers } from "../../../../providers";
import { Holds } from "@/components/(reusable)/holds";
import PageSelector from "./pageSelector";
import { Toaster } from "sonner";

export type LayoutProps = {
  forms: ReactNode;
  timesheets: ReactNode;
  reports: ReactNode;
  params: { url: string };
};

export default async function PersonnelLayout({
  forms,
  timesheets,
  reports,
  params,
}: LayoutProps) {
  const messages = await getMessages();

  const section = params.url;

  return (
    <Holds className="w-full h-full">
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3000}
          />
          {/* Dynamically render children based on the section */}
          {params.url.startsWith("forms") ? (
            forms // Use forms directly as a ReactNode
          ) : params.url.startsWith("timesheets") ? (
            timesheets // Use timesheets directly as a ReactNode
          ) : params.url.startsWith("reports") ? (
            reports // Use reports directly as a ReactNode
          ) : (
            <div>Invalid section</div>
          )}
        </Providers>
      </NextIntlClientProvider>
    </Holds>
  );
}
