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
    <Holds className="w-full h-full ">
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <Grids cols={"10"} gap={"5"} className="">
            <Holds className="col-span-3 h-full w-full">{search}</Holds>
            <Holds background={"white"} className="col-span-7 h-full w-full">
              {view}
              {children}
            </Holds>
          </Grids>
        </Providers>
      </NextIntlClientProvider>
    </Holds>
  );
}
