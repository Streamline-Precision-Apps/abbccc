"use server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { redirect } from "next/navigation";
import MobileCheck from "./(content)/mobileCheck";
import { Grids } from "@/components/(reusable)/grids";
import HamburgerMenuNew from "@/components/(animations)/hamburgerMenuNew";
import WidgetSection from "./(content)/widgetSection";

export default async function Home() {
  //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect("/signin");
  } else if (!session.user.accountSetup) {
    // Redirect to account setup if not completed
    redirect("/signin/signup");
  }

  // Get the current language from cookies
  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en";

  return (
    <Bases>
      <Contents>
        <Grids rows={"8"} gap={"5"}>
          <HamburgerMenuNew />
          <WidgetSection locale={locale} session={session} />
        </Grids>
      </Contents>
    </Bases>
  );
}
