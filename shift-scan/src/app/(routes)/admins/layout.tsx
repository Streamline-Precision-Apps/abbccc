import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import LeftSidebar from "./_pages/sidebar/leftSide";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <SidebarProvider>
        <Sidebar variant={"sidebar"}>
          <LeftSidebar />
        </Sidebar>
        {children}
      </SidebarProvider>
    </>
  );
}
