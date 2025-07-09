"use client";
import "@/app/globals.css";
import { useSidebar } from "@/components/ui/sidebar";
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
      white: "",
      link: "/admins/personnel",
    },
    {
      id: 3,
      title: "Assets",
      img: "equipment",
      white: "",
      link: "/admins/assets",
    },
    {
      id: 4,
      title: "Reports",
      img: "formList",
      white: "",
      link: "/admins/reports",
    },
    { id: 5, title: "Forms", img: "form", white: "", link: "/admins/forms" },
    {
      id: 6,
      title: "Timesheets",
      img: "formInspect",
      white: "",
      link: "/admins/timesheets",
    },
  ];

  return (
    <div className={`h-full w-fit bg-opacity-40  p-2 `}>
      <div className="flex items-center justify-center bg-white  rounded-lg p-1">
        <img src="/logo.svg" alt="logo" className="w-24 h-auto" />
      </div>
      <div className="mt-4">
        <ul className="space-y-4">
          {Page.map((item) => (
            <li
              key={item.id}
              className={`w-full rounded-lg px-2 py-1 ${
                pathname === item.link
                  ? "bg-app-dark-blue text-white"
                  : "hover:bg-white hover:bg-opacity-30"
              }`}
            >
              <Link href={item.link} className="w-full">
                <div
                  className={`flex flex-row items-center gap-2 p-1 rounded-lg transition-colors `}
                >
                  <img
                    src={`/${item.img}.svg`}
                    alt={item.title}
                    className="w-4 h-4"
                  />
                  <p className="text-xs ">{item.title}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
