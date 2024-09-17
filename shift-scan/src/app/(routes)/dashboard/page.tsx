import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Content from "./content";
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  const userId = session?.user.id;

  // Fetch all records
  const jobCodes = await prisma.jobsites.findMany({
    select: {
      id: true,
      qrId: true,
      name: true,
    },
  });

  const costCodes = await prisma.costCodes.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  const equipment = await prisma.equipment.findMany({
    select: {
      id: true,
      qrId: true,
      name: true,
    },
  });

  // Fetch recent records
  const recentJobSites = await prisma.jobsites.findMany({
    select: {
      id: true,
      qrId: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const recentCostCodes = await prisma.costCodes.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const recentEquipment = await prisma.equipment.findMany({
    select: {
      id: true,
      qrId: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en"; // Default to English

  const currentDate = new Date();
  const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

  let logs;

  logs = await prisma.employeeEquipmentLogs.findMany({
    where: {
      employeeId: userId,
      createdAt: { lte: currentDate, gte: past24Hours },
      isSubmitted: false,
    },
    include: {
      Equipment: {
        select: {
          id: true,
          qrId: true,
          name: true,
        },
      },
    },
  });

  logs = logs.map((log) => ({
    id: log.id.toString(),
    employeeId: log.employeeId,
    equipment: log.Equipment?.id
      ? {
          id: log.Equipment.id,
          qrId: log.Equipment.qrId,
          name: log.Equipment.name,
        }
      : null,
    submitted: log.isSubmitted,
  }));

  return (
    <Content
      locale={locale}
      jobCodes={jobCodes}
      costCodes={costCodes}
      equipment={equipment}
      recentJobSites={recentJobSites}
      recentCostCodes={recentCostCodes}
      recentEquipment={recentEquipment}
      logs={logs} // Pass logs to Content
    />
  );
}
