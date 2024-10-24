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

  return (
    <Bases>
      <Contents>
        <Grids rows={"1"}>
          <Holds className="h-full row-span-1  ">
            <ClockOutContent />;
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
