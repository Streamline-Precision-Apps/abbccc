"use server";
import { auth } from "@/auth";
import ClockOutContent from "./clockOutContent";
import { redirect } from "next/navigation";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const userId = session.user.id;

  return (
    <Bases>
      <Contents>
        <Grids className="grid-rows-1">
          <Holds className="h-full row-span-1">
            <ClockOutContent id={userId} />;
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
