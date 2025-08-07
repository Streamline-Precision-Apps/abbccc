"use client";
import "@/app/globals.css";
import { UserEditProvider } from "@/app/context/(admin)/UserEditContext";
import { CrewEditProvider } from "@/app/context/(admin)/CrewEditContext";
import { Toaster } from "@/components/ui/sonner";
import LeftSidebar from "./_pages/sidebar/leftSide";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Spinner from "@/components/(animations)/spinner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    const permission = session?.user?.permission;
    if (permission !== "ADMIN" && permission !== "SUPERADMIN") {
      setNotAuthorized(true);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Spinner />;
  }

  if (notAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-white">
          You are not authorized to view these pages.
        </h1>
      </div>
    );
  }

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
