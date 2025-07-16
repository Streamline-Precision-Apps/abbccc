"use client";
import "@/app/globals.css";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LeftSidebar() {
  const pathname = usePathname();
  const { open: isOpen } = useSidebar();

  const Page = [
    // { id: 1, title: "Dashboard", img: "home", white: "", link: "/admins" },
    {
      id: 2,
      title: "Personnel",
      img: "team",
      white: "team-white",
      link: "/admins/personnel",
    },
    {
      id: 7,
      title: "Equipment",
      img: "equipment",
      white: "equipment-white",
      link: "/admins/equipment",
    },
    {
      id: 8,
      title: "Jobsites",
      img: "jobsite",
      white: "jobsite-white",
      link: "/admins/jobsites",
    },
    {
      id: 9,
      title: "Cost Codes",
      img: "qrCode",
      white: "qrCode-white",
      link: "/admins/cost-codes",
    },
    {
      id: 10,
      title: "Clients",
      img: "admin",
      white: "admin-white",
      link: "/admins/clients",
    },
    {
      id: 4,
      title: "Reports",
      img: "formList",
      white: "formList-white",
      link: "/admins/reports",
    },
    {
      id: 5,
      title: "Forms",
      img: "form",
      white: "form-white",
      link: "/admins/forms",
    },
    {
      id: 6,
      title: "Timesheets",
      img: "formInspect",
      white: "formInspect-white",
      link: "/admins/timesheets",
    },
  ];

  return (
    <Sidebar className="w-[--sidebar-width] h-full">
      <SidebarContent className="h-full bg-white bg-opacity-25 ">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="w-full h-16 flex items-center justify-center bg-white rounded-lg ">
              <img src="/logo.svg" alt="logo" className="w-24 h-10" />
            </div>
            <SidebarMenu className="w-full mt-4">
              {Page.map((item) => {
                // Check if the first segment of the current path matches the item's link
                // e.g. /admins/forms/1234 should match /admins/forms
                const itemBase = item.link
                  .split("/")
                  .filter(Boolean)
                  .slice(0, 3)
                  .join("/");
                const pathBase = pathname
                  .split("/")
                  .filter(Boolean)
                  .slice(0, 3)
                  .join("/");
                const isActive = itemBase === pathBase;
                return (
                  <Link key={item.id} href={item.link} className="w-full">
                    <SidebarMenuItem className="py-2">
                      <div
                        className={`flex flex-row items-center gap-4 p-2 rounded-lg transition-colors ${
                          isActive ? "bg-app-dark-blue text-white" : ""
                        }`}
                      >
                        <img
                          src={`/${isActive ? item.white : item.img}.svg`}
                          alt={item.title}
                          className="w-4 h-4"
                        />
                        <p
                          className={`text-base ${
                            isActive ? "text-white" : ""
                          }`}
                        >
                          {item.title}
                        </p>
                      </div>
                    </SidebarMenuItem>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
