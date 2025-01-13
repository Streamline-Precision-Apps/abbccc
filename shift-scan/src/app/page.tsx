"use server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import WidgetSection from "@/app/(content)/widgetSection";
import { Images } from "@/components/(reusable)/images";
import { redirect } from "next/navigation";
import { AnimatedHamburgerButton } from "@/components/(animations)/hamburgerMenu";

export default async function Home() {
  //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect("/signin");
  }
  // Get the current language from cookies
  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en";

  // Pass the fetched data to the client-side Content component

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"}>
          <Holds position={"row"} background={"white"} className="row-span-1">
            <Holds size={"30"}>
              <Images
                titleImg="/logo.svg"
                titleImgAlt="logo"
                position={"left"}
                size={"full"}
                className="m-2"
              />
            </Holds>
            <Holds size={"70"}>
              <AnimatedHamburgerButton />
            </Holds>
          </Holds>

          <WidgetSection locale={locale} session={session} />
        </Grids>
      </Contents>
    </Bases>
  );
}
