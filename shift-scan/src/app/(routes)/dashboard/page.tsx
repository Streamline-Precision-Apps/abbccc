"use server";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { AnimatedHamburgerButton } from "@/components/(animations)/hamburgerMenu";
import { redirect } from "next/navigation";
import DbWidgetSection from "./dbWidgetSection";
import { Grids } from "@/components/(reusable)/grids";
import BannerRotating from "@/components/(reusable)/bannerRotating";
import { cookies } from "next/headers";

export default async function Dashboard() {
  //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect("/signin");
  }

  // const user = session.user;
  const view = cookies().get("workRole")?.value || "general"; // Default to general view if not set
  // Get the current language from cookies
  // Get the current language from cookies
  // const lang = cookies().get("locale");
  // const locale = lang ? lang.value : "en";

  // const date = new Date().toLocaleDateString(locale, {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  //   weekday: "long",
  // });

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
          <Holds className="row-span-1 bg-app-blue bg-opacity-20 w-full pt-2 pb-6 my-2 rounded-[10px]">
            <BannerRotating />
          </Holds>
          <Holds background={"white"} className="row-span-5 h-full">
            <DbWidgetSection session={session} view={view} />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
