"use client";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import LeftSidebar from "./_pages/sidebar/leftSide";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { useNotification } from "@/hooks/useNotification";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { subscribeToNotifications } = useNotification();
  useEffect(() => {
    // Subscribe to notifications when the component mounts
    subscribeToNotifications();
  }, [subscribeToNotifications]);
  return (
    <>
      <Toaster position="top-right" richColors closeButton duration={3000} />

      <SidebarProvider>
        <Sidebar variant={"sidebar"}>
          <LeftSidebar />
        </Sidebar>
        {children}
      </SidebarProvider>
    </>
  );
}
