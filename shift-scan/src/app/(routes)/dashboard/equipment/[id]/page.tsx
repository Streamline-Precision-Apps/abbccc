"use server";
import prisma from "@/lib/prisma";
import Content from "./content";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

export default async function Page({ params }: { params: { form: string } }) {
  const session = await auth();
  if (!session) return null;
  const userId = session.user.id;

  // Log counts for debugging
  return (
    <Bases>
      <Contents>
      <Holds>
        <Content userId={userId} formId={params.form} />
      </Holds>
      </Contents>
    </Bases>
  );
}

// // Extract values from equipment form and creates and pass individual props of items
// const start_time = new Date(equipmentform?.startTime ?? "");
// const completed = equipmentform?.isCompleted;
// const savedDuration = equipmentform?.duration?.toFixed(2);
// const filled = equipmentform?.isRefueled;
// const fuelUsed = equipmentform?.fuelUsed?.toString();
// const eqname = equipmentform?.Equipment?.name?.toString();
// const eqid = equipmentform?.id?.toString();
// const equipment_notes = userNotes?.comment?.toString() ;
