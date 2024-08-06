import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Content from "./content";

export default async function Dashboard() {
  const user = cookies().get("user");
  const userId = user?.value;

  // Fetch all records
  const jobCodes = await prisma.jobsite.findMany({
    select: {
      id: true,
      jobsite_id: true,
      jobsite_name: true,
    },
  });

  const costCodes = await prisma.costCode.findMany({
    select: {
      id: true,
      cost_code: true,
      cost_code_description: true,
    },
  });

  const equipment = await prisma.equipment.findMany({
    select: {
      id: true,
      qr_id: true,
      name: true,
    },
  });

  // Fetch recent records
  const recentJobSites = await prisma.jobsite.findMany({
    select: {
      id: true,
      jobsite_id: true,
      jobsite_name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const recentCostCodes = await prisma.costCode.findMany({
    select: {
      id: true,
      cost_code: true,
      cost_code_description: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const recentEquipment = await prisma.equipment.findMany({
    select: {
      id: true,
      qr_id: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const userCookie = cookies().get("user");
  const userid = userCookie ? userCookie.value : undefined;

  const currentDate = new Date();
  const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

  let logs;

  logs = await prisma.employeeEquipmentLog.findMany({
    where: {
      employee_id: userid,
      createdAt: { lte: currentDate, gte: past24Hours },
      submitted: false,
    },
    include: {
      Equipment: {
        select: {
          id: true,
          qr_id: true,
          name: true,
        },
      },
    },
  });

  logs = logs.map((log) => ({
    id: log.id.toString(),
    employee_id: log.employee_id,
    equipment: log.Equipment?.id
      ? {
          id: log.Equipment.id,
          qr_id: log.Equipment.qr_id,
          name: log.Equipment.name,
        }
      : null,
    submitted: log.submitted,
  }));

  return (
    <Content
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
