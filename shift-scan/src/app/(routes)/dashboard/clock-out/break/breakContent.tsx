"use client";
import "@/app/globals.css";
import { useTranslations } from "next-intl";
import AppUser from "@/app/(content)/name";
import BreakWidgetSection from "@/app/(routes)/dashboard/clock-out/break/breakWidgetSection";
import { useSession } from "next-auth/react";
import { CustomSession, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { useSavedBreakTime } from "@/app/context/SavedBreakTimeContext";
import DisplayBreakTime from "./displayBreakTime";

// I put this into the content page to allow all the pages
// to have access to the user object
export default function BreakContent() {
  const t = useTranslations("page1");
  const { data: session } = useSession() as { data: CustomSession | null };
  // const {data: token} = useSession()as { data: CustomSession | null };
  const { breakTime, setBreakTime } = useSavedBreakTime();
  const [toggle, setToggle] = useState(true);

  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    image: "",
    firstName: "",
    lastName: "",
    permission: "",
  });

  useEffect(() => {
    if (session && session.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        permission: session.user.permission,
      });
    }
  }, [session]);
  const handler = () => {
    setToggle(!toggle);
    console.log(toggle);
  };
  // rerun at clock out to get updated hours
  const countingBreakTime = () => {};

  return (
    <>
      <AppUser user={user} />
      <DisplayBreakTime setToggle={handler} display={toggle} />
      <BreakWidgetSection user={user} display={toggle} />
    </>
  );
}
