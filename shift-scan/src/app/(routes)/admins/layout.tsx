"use client";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import LeftSidebar from "./_pages/sidebar/leftSide";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardDataProvider } from "./_pages/sidebar/DashboardDataContext";
import { UserProfileProvider } from "./_pages/sidebar/UserImageContext";
import useFcmToken from "@/hooks/useFcmToken";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, notificationPermissionStatus } = useFcmToken();
  return (
    <>
      <Toaster position="top-right" richColors closeButton duration={3000} />
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
