"use client";
import "@/app/globals.css";
import { UserEditProvider } from "@/app/context/(admin)/UserEditContext";
import { CrewEditProvider } from "@/app/context/(admin)/CrewEditContext";
import { Toaster } from "@/components/ui/sonner";
import LeftSidebar from "./_pages/leftSide";
import { Bases } from "@/components/(reusable)/bases";

import { Sidebar, SidebarProvider, useSidebar } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  <div className="bg-white bg-opacity-80 h-[85vh] pb-[1.5em] w-full flex flex-col gap-4 rounded-lg relative"></div>;
  return (
    <Bases size={"screen"} className="w-full">
      <Toaster position="top-right" richColors closeButton duration={3000} />
      <UserEditProvider>
        <CrewEditProvider>
          <SidebarProvider>
            <Sidebar className="h-full w-[250px] bg-white bg-opacity-25 border-r border-slate-800">
              <LeftSidebar />
            </Sidebar>
            <div className={`h-full w-full p-4"`}>{children}</div>
          </SidebarProvider>
        </CrewEditProvider>
      </UserEditProvider>
    </Bases>
  );
}
