"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/Holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";
import prisma from "@/lib/prisma";
import { Contents } from "@/components/(reusable)/contents";

export default async function QrGeneratorDashboard() {
  const jobCodes = await prisma.jobsites.findMany({
    select: {
      id: true,
      qrId: true,
      name: true,
    },
  });


  const equipment = await prisma.equipment.findMany({
    select: {
      id: true,
      qrId: true,
      name: true,
    },
  });

  return (
    <Bases>
    <Contents>
        <QrJobsiteContent  jobCodes={jobCodes} />
      <Holds size={"half"}>
        <QrEquipmentContent equipment={equipment} />
      </Holds>
    </Contents>
    </Bases>
  );
}
