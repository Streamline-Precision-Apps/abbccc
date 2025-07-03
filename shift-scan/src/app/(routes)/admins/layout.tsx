"use client";
import "@/app/globals.css";
import { UserEditProvider } from "@/app/context/(admin)/UserEditContext";
import { CrewEditProvider } from "@/app/context/(admin)/CrewEditContext";
import { Toaster } from "@/components/ui/sonner";
import LeftSidebar from "./_pages/leftSide";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bases } from "@/components/(reusable)/bases";

import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Bases size={"screen"} className="w-full">
      <Toaster position="top-right" richColors closeButton duration={3000} />
      <UserEditProvider>
        <CrewEditProvider>
          <SidebarProvider>
            <Sidebar className="h-full w-[250px] bg-white bg-opacity-25 border-r border-slate-800">
              <LeftSidebar />
            </Sidebar>
            <div className="h-full w-full p-4">{children}</div>
          </SidebarProvider>
        </CrewEditProvider>
      </UserEditProvider>
    </Bases>
  );
}
