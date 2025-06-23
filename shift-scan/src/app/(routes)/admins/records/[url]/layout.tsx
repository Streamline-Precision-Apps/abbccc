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
  const section = params.url; // determines which url section to render
  const messages = await getMessages();

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
          {section.startsWith("forms") ? (
            forms // Use forms directly as a ReactNode
          ) : section.startsWith("timesheets") ? (
            timesheets // Use timesheets directly as a ReactNode
          ) : section.startsWith("reports") ? (
            reports // Use reports directly as a ReactNode
          ) : (
            <div>Invalid section</div>
          )}
        </Providers>
      </NextIntlClientProvider>
    </Holds>
  );
}
