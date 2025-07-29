"use server";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { redirect } from "next/navigation";
import DbWidgetSection from "./dbWidgetSection";
import { Grids } from "@/components/(reusable)/grids";
import BannerRotating from "@/components/(reusable)/bannerRotating";
import { cookies } from "next/headers";
import HamburgerMenuNew from "@/components/(animations)/hamburgerMenuNew";

export default async function Dashboard() {
  //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect("/signin");
  }

  // kicks user out if they are not clocked in
  const currentPageView = (await cookies()).get("currentPageView")?.value;
  if (currentPageView !== "dashboard") {
    redirect("/");
  }

  const mechanicProjectID =
    (await cookies()).get("mechanicProjectID")?.value || "";

  // const user = session.user;
  const view = (await cookies()).get("workRole")?.value || "general"; // Default to general view if not set
  const laborType = (await cookies()).get("laborType")?.value || "";

  return (
    <Bases>
      <Contents>
        <Grids rows={"8"} gap={"5"}>
          <HamburgerMenuNew />
          <Holds className="row-start-2 row-end-4 bg-app-blue bg-opacity-20 w-full h-full justify-center items-center rounded-[10px]">
            <BannerRotating />
          </Holds>
          <Holds background={"white"} className="row-start-4 row-end-9 h-full">
            <DbWidgetSection
              session={session}
              view={view}
              mechanicProjectID={mechanicProjectID}
              laborType={laborType}
            />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
