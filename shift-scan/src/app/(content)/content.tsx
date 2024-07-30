"use client";

import "@/app/globals.css";
import { useTranslations } from "next-intl";
import Hours from "@/app/(content)/hours";
import WidgetSection from "@/components/widgetSection";
import { useSession } from "next-auth/react";
import { CustomSession, User } from "@/lib/types";
import { useEffect, useState} from "react";
import { useSavedPayPeriodHours } from "../context/SavedPayPeriodHours";
import { useSavedUserData } from "../context/UserContext";
import { getAuthStep } from "../api/auth";
import DisplayBreakTime from "./displayBreakTime";
import { useRouter } from "next/navigation";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { Modals } from "@/components/(reusable)/modals";
import { Headers } from "@/components/(reusable)/headers";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Footers } from "@/components/(reusable)/footers";



export default function Content() {
  const t = useTranslations("page1");
  const { data: session } = useSession() as { data: CustomSession | null };
  const { setPayPeriodHours } = useSavedPayPeriodHours();
  const [toggle, setToggle] = useState(true);
  const { setSavedUserData } = useSavedUserData();
  const router = useRouter();
  const date = new Date().toLocaleDateString( 'en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' });
  const [user, setData] = useState<User>({
    id: "",
    name: "",
    firstName: "",
    lastName: "",
    permission: "",
  });

  useEffect(() => {
    if (authStep ==="success") {
      router.push("/dashboard");
    }
  }, []);

  /* Todo: rather then use this use effect and save the data in a context
  maybe look into using the cookie or local storage that way there isnt a load up state of user.
  pulling from the database slows down the load of the pages and cause there to be 
  empty data if the session isnt loaded in correctly. 
  
  response:
   */

  useEffect(() => {
    if (session && session.user) {
      setSavedUserData({
        id: session.user.id,
      });
      setData({
        id: session.user.id,
        name: session.user.name,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        permission: session.user.permission,
      });

      setHoursContext();
    }
  }, [session]);
  const handler = () => {
    setToggle(!toggle);
    console.log(toggle);
  };
/*  ToDo: beable to get the set hours from user according to his hours work that day
  for a hint look at the my team section under recieveing time card and how to do that prisma call
  then look at adding the duration all together. Total hours will show the full two week pay period
  and the hours will be to 2 decimal places. you may want to place in another file however it must be client
  side to function since this is client side 

  response:
*/
  const setHoursContext = () => {
    const totalhours = 20.45;
    setPayPeriodHours(String(totalhours));
  };
  

  const authStep = getAuthStep();

  if (authStep === "break") {
    return (
      <>
      <Banners variant={"default"} size={"default"}>
                <Titles variant={"default"} size={"h1"}>{t("Banner")}</Titles>
                <Texts variant={"default"} size={"p1"}>{t("Date", { date })}</Texts>
        </Banners>
          <Texts variant={"name"} size={"p1"}>{t("Name", { firstName: user.firstName, lastName: user.lastName })}</Texts>
          <DisplayBreakTime setToggle={handler} display={toggle} />
          <WidgetSection user={user} display={toggle} />
      </>
    );
  }
  else {
    return (
      <>
        <Banners variant={"default"} size={"default"}>
                <Titles variant={"default"} size={"h1"}>{t("Banner")}</Titles>
                <Texts variant={"default"} size={"p1"}>{t("Date", { date })}</Texts>
        </Banners>
          <Texts variant={"name"} size={"p1"}>{t("Name", { firstName: user.firstName, lastName: user.lastName })}</Texts>
          <Hours setToggle={handler} display={toggle} />
          <WidgetSection user={user} display={toggle} />
      </>
    );
  }
}
