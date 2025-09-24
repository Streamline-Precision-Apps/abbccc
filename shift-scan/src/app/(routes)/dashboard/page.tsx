"use server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import OfflineAwareDashboard from "@/components/(offline)/OfflineAwareDashboard";

export default async function Dashboard() {
  //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect("/signin");
  }

  // Get server-side cookie values (might be undefined when offline)
  const currentPageView = (await cookies()).get("currentPageView")?.value;
  const mechanicProjectID =
    (await cookies()).get("mechanicProjectID")?.value || "";
  const prevTimeSheetId = (await cookies()).get("prevTimeSheet")?.value || null;
  const view = (await cookies()).get("workRole")?.value || "general";
  const laborType = (await cookies()).get("laborType")?.value || "";

  // Pass all values to client component for offline-aware handling
  return (
    <OfflineAwareDashboard
      session={session}
      serverCurrentPageView={currentPageView}
      serverView={view}
      serverMechanicProjectID={mechanicProjectID}
      serverLaborType={laborType}
      serverPrevTimeSheetId={prevTimeSheetId}
    />
  );
}
