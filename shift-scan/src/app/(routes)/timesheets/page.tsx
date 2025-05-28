"use server";
import { auth } from "@/auth";
import ViewTimeSheets from "@/app/(routes)/timesheets/view-timesheets";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { redirect } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";

export default async function Timesheets() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const id = session?.user.id;

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          <ViewTimeSheets user={id} />
        </Grids>
      </Contents>
    </Bases>
  );
}
