import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Banners } from "@/components/(reusable)/banners";
import { Holds } from "@/components/(reusable)/holds";
import { Sections } from "@/components/(reusable)/sections";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Headers } from "@/components/(reusable)/headers";
import WidgetSection from "@/app/(content)/widgetSection";
import Capitalize from "@/utils/captitalize";
import NameContainer from "@/app/(content)/nameContainer";

export default async function Home() {
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
    <Bases>
      <Contents variant={"center"} size={"container"}>
      <Sections size={"dynamic"}>
      <Holds >
      <Headers variant={"relative"} size={"default"}></Headers>

      <Banners variant={"default"}>
            <Titles variant={"default"} size={"h1"}>
              {t("Banner")}
            </Titles>
            <Texts variant={"default"} size={"p1"}>
              {t("Date", { date: Capitalize(date) })}
            </Texts>
          </Banners>
          <Texts size={"p0"} className="text-center py-4">
            {t("Name", {
              firstName: Capitalize(user.firstName),
              lastName: Capitalize(user.lastName),
            })}
          </Texts>

          <WidgetSection session={session}/> 

      </Holds>
        </Sections>
      </Contents>
    </Bases>
  );
}