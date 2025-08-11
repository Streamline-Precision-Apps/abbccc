"use client";
import "@/app/globals.css";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SignOutModal from "./SignOutModal";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LeftSidebar() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [isProfileOpened, setIsProfileOpened] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const { data: session } = useSession();
  const name =
    session?.user?.firstName + " " + session?.user?.lastName.slice(0, 1) ||
    "No Name Available";
  const role = session?.user?.permission || "User";

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await fetch(`/api/getUserImage`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile picture");
        }
        const data = await response.json();
        setProfilePicture(data.image || null);
        // Handle the profile picture data as needed
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchProfilePicture();
  }, []);

  const Page = [
    {
      id: 1,
      title: "Dashboard",
      img: "home",
      white: "home-white",
      link: "/admins",
    },
    {
      id: 2,
      title: "Personnel",
      img: "user",
      white: "user-white",
      link: "/admins/personnel",
    },
    {
      id: 3,
      title: "Crews",
      img: "team",
      white: "team-white",
      link: "/admins/crew",
    },
    {
      id: 4,
      title: "Equipment",
      img: "equipment",
      white: "equipment-white",
      link: "/admins/equipment",
    },
    {
      id: 5,
      title: "Jobsites",
      img: "jobsite",
      white: "jobsite-white",
      link: "/admins/jobsites",
    },
    {
      id: 6,
      title: "Cost Codes",
      img: "qrCode",
      white: "qrCode-white",
      link: "/admins/cost-codes",
    },
    {
      id: 7,
      title: "Reports",
      img: "formList",
      white: "formList-white",
      link: "/admins/reports",
    },
    {
      id: 8,
      title: "Forms",
      img: "form",
      white: "form-white",
      link: "/admins/forms",
    },
    {
      id: 9,
      title: "Timesheets",
      img: "formInspect",
      white: "formInspect-white",
      link: "/admins/timesheets",
    },
  ];

  return (
    <Sidebar className="w-[--sidebar-width] h-full">
      <SidebarContent className="h-full bg-white bg-opacity-25 flex flex-col">
        <SidebarGroupContent className="flex-1 flex flex-col">
          <SidebarGroup>
            <div className="w-full h-16 flex items-center justify-center bg-white rounded-lg ">
              <img src="/logo.svg" alt="logo" className="w-24 h-10" />
            </div>

            <SidebarMenu className="w-full h-full mt-4">
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
              {/* Button at the bottom, separated from menu */}
            </SidebarMenu>
          </SidebarGroup>
          <div className={`mt-auto w-full flex justify-center p-2 h-fit`}>
            {isProfileOpened ? (
              <div className="bg-white rounded-[10px] w-full flex flex-col justify-between items-center ">
                {/* Profile section */}
                <div className="w-full px-4 py-2 bg-white rounded-[10px] inline-flex justify-start items-center gap-3">
                  <div className="flex items-center w-11 h-11 justify-center">
                    {profilePicture === null ? (
                      // Loading spinner
                      <svg
                        className="animate-spin h-7 w-7 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : (
                      <img
                        src={profilePicture || "/profileEmpty.svg"}
                        alt="profile"
                        className="w-11 h-11 rounded-full object-cover bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src = "/profileEmpty.svg";
                        }}
                      />
                    )}
                  </div>
                  <div className="inline-flex flex-col  flex-1 justify-center items-start">
                    <div className="justify-start text-black text-xs font-bold ">
                      {name.length >= 12 ? name.slice(0, 12) + "..." : name}
                    </div>
                    <div className="text-center justify-start text-neutral-400 text-[10px] font-normal ">
                      {role}
                    </div>
                  </div>
                  <div className="flex justify-end items-center w-fit">
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="bg-transparent border-none rounded-lg w-fit hover:bg-white"
                      onClick={() => setIsProfileOpened(false)}
                    >
                      <ChevronDown className="w-2 h-1.5" color="black" />
                    </Button>
                  </div>
                </div>
                <div className="w-full flex px-4 py-2 justify-start">
                  <Button
                    variant={"ghost"}
                    className="flex flex-row  items-center gap-2 rounded-lg"
                    onClick={() => setShowModal(true)}
                  >
                    <LogOut className="w-2 h-1.5  " color={`black`} />
                    <p className="text-[10px]">Log Out</p>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full px-4 py-2 bg-white rounded-[10px] inline-flex justify-start items-center gap-3">
                <div className="flex items-center w-11 h-11 justify-center">
                  {profilePicture === null ? (
                    // Loading spinner
                    <svg
                      className="animate-spin h-7 w-7 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    <img
                      src={profilePicture || "/profileEmpty.svg"}
                      alt="profile"
                      className="w-11 h-11 rounded-full object-cover bg-gray-100"
                      onError={(e) => {
                        e.currentTarget.src = "/profileEmpty.svg";
                      }}
                    />
                  )}
                </div>
                <div className="inline-flex flex-col  flex-1 justify-center items-start">
                  <div className="justify-start text-black text-xs font-bold ">
                    {name.length >= 12 ? name.slice(0, 12) + "..." : name}
                  </div>
                  <div className="text-center justify-start text-neutral-400 text-[10px] font-normal ">
                    {role}
                  </div>
                </div>
                <div className="flex justify-end items-center w-fit">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="bg-transparent border-none rounded-lg w-fit hover:bg-white"
                    onClick={() => setIsProfileOpened(true)}
                  >
                    <ChevronUp className="w-2 h-1.5" color="black" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SidebarGroupContent>

        {/* Modal */}
        {showModal && <SignOutModal open={showModal} setOpen={setShowModal} />}
      </SidebarContent>
    </Sidebar>
  );
}
