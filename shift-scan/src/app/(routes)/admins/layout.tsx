import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "../../providers";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import LeftSidebar from "@/app/(routes)/admins/_pages/leftSideBar";
import TopTabBar from "./_pages/topTabBar";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <Bases size={"screen"}>
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <Contents width={"100"} className="">
          <Holds className="h-[60px]">
            <TopTabBar />
          </Holds>
          <Holds position={"row"} className="h-full">
            <Holds position={"test"} className="h-full w-[60px]">
              <LeftSidebar/>
            </Holds>
            <Holds className="p-3 h-full no-scrollbar overflow-y-auto">
              {children}
            </Holds>
          </Holds>
          </Contents>
        </Providers>
      </NextIntlClientProvider>
    </Bases>
  );
}
