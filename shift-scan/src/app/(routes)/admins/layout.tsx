"use client";
import "@/app/globals.css";
import { UserEditProvider } from "@/app/context/(admin)/UserEditContext";
import { CrewEditProvider } from "@/app/context/(admin)/CrewEditContext";
import { Toaster } from "@/components/ui/sonner";
import LeftSidebar from "./_pages/leftSide";

import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" richColors closeButton duration={3000} />
      <UserEditProvider>
        <CrewEditProvider>
          <SidebarProvider>
            <Sidebar variant={"sidebar"}>
              <LeftSidebar />
            </Sidebar>
            {children}
          </SidebarProvider>
        </CrewEditProvider>
      </UserEditProvider>
    </>
  );
}
