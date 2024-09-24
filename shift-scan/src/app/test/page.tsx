import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import { Headers } from "@/components/(reusable)/headers";
import { Holds } from "@/components/(reusable)/holds";
import { Banners } from "@/components/(reusable)/banners";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import Capitalize from "@/utils/captitalize";
import {getTranslations} from "next-intl/server"; 
import NameContainer from "../(content)/nameContainer";
import { Buttons } from "@/components/(reusable)/buttons";
import WidgetSection from "../(content)/widgetSection";

export default async function Test() {
  //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  const t = await getTranslations("Home");
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    return { redirect: { destination: '/signin', permanent: false } };
  }

  const user = session.user;
  const userId = session.user.id;
  const permission = session.user.permission;

  // Get the current language from cookies
  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en";

  const date = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  });


  // Pass the fetched data to the client-side Content component
  return (
    <Bases variant={"default"}>
      <Contents variant={"default"} size={"test"}>
      <Sections size={"default"}>
      <Holds>
      <Contents variant={"header"} size={null}>
            <Headers variant={"relative"} size={"default"}></Headers>
      </Contents>
      <Banners variant={"default"}>
            <Titles variant={"default"} size={"h1"}>
              {t("Banner")}
            </Titles>
            <Texts variant={"default"} size={"p1"}>
              {t("Date", { date: Capitalize(date) })}
            </Texts>
          </Banners>
          <NameContainer firstName={user.firstName} lastName={user.firstName}/>
          <WidgetSection session={session}/> 
      </Holds>
        </Sections>
      </Contents>
    </Bases>
  );
}