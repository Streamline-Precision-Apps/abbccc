"use client";
import { Holds } from "@/components/(reusable)/holds";
import { AdminContact } from "./settings/contact";
// import { AdminEditContact } from "./settings/AdminEditContact";
import { AdminNotifications } from "./settings/AdminNotifications";
import { AdminInbox } from "./settings/AdminInbox";
import { useSession } from "next-auth/react";
export const AdminSettings = () => {
  const { data: Session } = useSession();

  if (!Session) {
    return null;
  }
  const id = Session.user.id;

  return (
    <Holds className="w-full h-full">
      <Holds position={"row"} className="h-full gap-5 ">
        <Holds className="flex-col h-full w-1/3 hidden lg:flex space-y-5 ">
          <Holds background={"white"} className="h-1/2 ">
            <AdminContact />
          </Holds>
          <Holds background={"white"} className="h-1/2">
            <AdminNotifications id={id} />
          </Holds>
        </Holds>
        <Holds className="h-full w-full">
          <AdminInbox />
        </Holds>
      </Holds>
    </Holds>
  );
};
