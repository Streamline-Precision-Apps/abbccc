"use server";
import EquipmentLogContent from "@/app/(routes)/dashboard/equipment/content";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";

export default async function Current() {
  const session = await auth();
  const userId = session?.user?.id;

  // use translate breaks here for what ever reason
  return (
    <Bases>
      <Contents>
        <EquipmentLogContent userId={userId} />
      </Contents>
    </Bases>
  );
}
