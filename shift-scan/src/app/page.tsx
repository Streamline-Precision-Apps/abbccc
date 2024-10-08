"use server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Banners } from "@/components/(reusable)/banners";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Grids } from "@/components/(reusable)/grids";
import WidgetSection from "@/app/(content)/widgetSection";
import { Images } from "@/components/(reusable)/images";
import Capitalize from "@/utils/captitalize";
import { redirect } from 'next/navigation'
import { AnimatedHamburgerButton } from "@/components/(animations)/hamburgerMenu";
import capitalizeAll from "@/utils/capitalizeAll";
export default async function Home() {
 //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  const t = await getTranslations("Home");
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect('/signin');
  }

  const user = session.user;

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
    <Bases>
      <Contents> 
        <Grids rows={"7"}>
          <Holds
          position={"row"} 
          background={"white"} 
          className="row-span-1">
            <Holds size={"30"}>
              <Images 
              titleImg="/logo.svg" 
              titleImgAlt="logo" 
              position={"left"}  
              size={"full"}
              className="m-2"/>
            </Holds>
            <Holds size={"70"}>
              <AnimatedHamburgerButton/>
            </Holds>
          </Holds>
          <Holds className="row-span-1">
            <Banners>
              <Titles text={"white"} size={"h2"}>
                {t("Banner")}
                {t("Name", {
                  firstName: Capitalize(user.firstName)
                })}!
              </Titles>
              <Texts text={"white"} size={"p3"}>
                {t("Date", { date: capitalizeAll(date) })}
              </Texts>
            </Banners>
          </Holds>
          <Holds
          background={"white"}
          className="row-span-5 h-full">
            <WidgetSection session={session}/> 
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}