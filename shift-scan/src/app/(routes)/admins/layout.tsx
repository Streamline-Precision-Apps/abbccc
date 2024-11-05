import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "../../providers";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import Sidebar from "@/app/(routes)/admins/_pages/sidebar";
import Topbar from "./_pages/topbar";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <Bases className="pb-5">
          <Holds position={"row"} className="w-full h-full">
            <Sidebar />
            <Holds className={"w-full h-full"}>
              <Holds className={"w-full h-[10%]"}>
                <Topbar />
              </Holds>
              <Holds className="w-full h-[90%]">{children}</Holds>
            </Holds>
          </Holds>
        </Bases>
      </Providers>
    </NextIntlClientProvider>
  );
}
