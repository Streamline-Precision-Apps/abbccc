"use server";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { cookies } from "next/headers";
import { Suspense } from "react";
import TruckingContexts from "./components/contents";
import TruckingContextsSkeleton from "./components/TruckingContextsSkeleton";

export default async function Inbox() {
  const session = await auth();
  if (!session) return null;
  const laborType = (await cookies()).get("laborType")?.value;

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="h-full">
          <Suspense fallback={<TruckingContextsSkeleton />}>
            <TruckingContexts laborType={laborType} />
          </Suspense>
        </Grids>
      </Contents>
    </Bases>
  );
}
