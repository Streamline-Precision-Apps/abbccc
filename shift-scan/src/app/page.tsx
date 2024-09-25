import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Banners } from "@/components/(reusable)/banners";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import WidgetSection from "@/app/(content)/widgetSection";
import { Images } from "@/components/(reusable)/images";
import Capitalize from "@/utils/captitalize";
import { redirect } from 'next/navigation'
import { AnimatedHamburgerButton } from "@/components/(animations)/hamburgerMenu";
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
    <Bases>
      <Contents className="h-[90%] mt-10">
      <Holds background={"white"} className="h-full">
      <Holds position={"row"} className="mb-5">
      <Holds size={"30"}>
      <Images 
                titleImg="/logo.svg" 
                titleImgAlt="logo" 
                position={"left"} 
                background={"none"} 
                size={"full"} />
              </Holds>
              <Holds size={"70"}>
                <AnimatedHamburgerButton/> {/* come back to this */}
              </Holds>
              </Holds>
              <Holds className="mb-10">
              <Banners position={"flex"}>
              <Titles text={"black"} size={"p1"}>{t("Banner")}</Titles>
              <Texts text={"black"} size={"p4"}>{t("Date", { date: Capitalize(date) })}</Texts>
            </Banners>
              </Holds>
              <Holds size={"full"}>
              <Texts text={"black"} size={"p2"}>
                {t("Name", {
                  firstName: Capitalize(user.firstName),
                  lastName: Capitalize(user.lastName),
                })}
              </Texts>
                </Holds>
                  <WidgetSection session={session}/> 
      </Holds>
      </Contents>
    </Bases>
  );
}