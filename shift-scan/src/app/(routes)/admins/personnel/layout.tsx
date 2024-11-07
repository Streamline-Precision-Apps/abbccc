import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "../../../providers";
import { ReactNode } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";

export default async function PersonnelLayout({
  children,
  view,
  search,
}: {
  children: ReactNode;
  view: ReactNode;
  search: ReactNode;
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <Holds>
          <Grids>
            {search}
            {view}
            {children}
          </Grids>
        </Holds>
      </Providers>
    </NextIntlClientProvider>
  );
}
