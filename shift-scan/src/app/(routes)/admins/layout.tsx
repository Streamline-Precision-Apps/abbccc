"use client";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import LeftSidebar from "./_pages/sidebar/leftSide";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import PushToastListener from "@/components/PushToastListener";
import PresencePing from "@/components/notifications/PresencePing";
import { useSession } from "next-auth/react";
import { DashboardDataProvider } from "./_pages/sidebar/DashboardDataContext";
import { UserProfileProvider } from "./_pages/sidebar/UserImageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return (
    <>
      <Toaster position="top-right" richColors closeButton duration={3000} />
      <PushToastListener />
      {userId && <PresencePing userId={userId} />}
      <DashboardDataProvider>
        <UserProfileProvider>
          <SidebarProvider>
            <Sidebar variant={"sidebar"}>
              <LeftSidebar />
            </Sidebar>
            {children}
          </SidebarProvider>
        </UserProfileProvider>
      </DashboardDataProvider>
    </>
  );
}
