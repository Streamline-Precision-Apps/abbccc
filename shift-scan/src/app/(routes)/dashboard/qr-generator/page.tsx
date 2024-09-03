"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";
import prisma from "@/lib/prisma";

export default async function QrGeneratorDashboard() {
  const jobCodes = await prisma.jobsite.findMany({
    select: {
      id: true,
      jobsite_id: true,
      jobsite_name: true,
    },
  });


  const equipment = await prisma.equipment.findMany({
    select: {
      id: true,
      qr_id: true,
      name: true,
    },
  });

  return (
    <Bases>
        <QrJobsiteContent  jobCodes={jobCodes} />
      <Sections size={"half"}>
        <QrEquipmentContent equipment={equipment} />
      </Sections>
    </Bases>
  );
}
