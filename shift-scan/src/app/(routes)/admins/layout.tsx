import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "../../providers";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import Sidebar from "@/app/(routes)/admins/_pages/sidebar";
import Topbar from "./_pages/topbar";
import { Grids } from "@/components/(reusable)/grids";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <Bases size={"screen"} className="py-5">
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <Holds position={"row"} className="w-full h-full">
            <Sidebar />
            <Holds className={"w-full h-full mt-2"}>
              <Grids rows={"8"}>
                <Holds className={"row-span-1 h-full "}>
                  <Topbar />
                </Holds>
                <Holds className="h-full row-span-7 px-4 py-1">
                  {children}
                </Holds>
              </Grids>
            </Holds>
          </Holds>
        </Providers>
      </NextIntlClientProvider>
    </Bases>
  );
}
