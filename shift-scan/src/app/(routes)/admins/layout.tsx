import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import LeftSidebar from "@/app/(routes)/admins/_pages/leftSideBar";
import TopTabBar from "./_pages/topTabBar";
import { Contents } from "@/components/(reusable)/contents";
import { UserEditProvider } from "@/app/context/(admin)/UserEditContext";
import { CrewEditProvider } from "@/app/context/(admin)/CrewEditContext";

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
        <UserEditProvider>
          <CrewEditProvider>
            <Contents width={"100"} className="">
              {/* Top bar */}
              <Holds className="h-[60px]">
                <TopTabBar />
              </Holds>
              {/* Main layout: sidebar + scrollable content */}
              <Holds
                position={"row"}
                className="h-[calc(100dvh-60px)] min-h-0 w-full"
              >
                {/* Sidebar */}
                <Holds position={"test"} className="h-full w-[60px] shrink-0">
                  <LeftSidebar />
                </Holds>
                {/* Scrollable content area */}
                <Holds className="flex-1 min-h-0 h-full p-3 overflow-y-auto no-scrollbar">
                  {children}
                </Holds>
              </Holds>
            </Contents>
          </CrewEditProvider>
        </UserEditProvider>
      </NextIntlClientProvider>
    </Bases>
  );
}
