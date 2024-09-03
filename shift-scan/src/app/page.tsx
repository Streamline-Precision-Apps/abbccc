import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Content from "@/app/(content)/content";
import { PayPeriodTimesheets } from "@/lib/types";
import { auth } from "@/auth"

export default async function Home() {
// Get the current user
  const session = await auth();
  const userid = session?.user.id;

// Get the current language
  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en"; 

// Calculate the start date of the current pay period
  const calculatePayPeriodStart = () => {
    const startDate = new Date(2024, 7, 5); // August 5, 2024
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    const diffWeeks = Math.floor(diff / (2 * 7 * 24 * 60 * 60 * 1000)); // Two-week intervals
    return new Date(
      startDate.getTime() + diffWeeks * 2 * 7 * 24 * 60 * 60 * 1000
    );
  };
// Calculate the start date of the current pay period
  const payPeriodStart = calculatePayPeriodStart();

// Calculate the start of today
  const currentDate = new Date();

  // Calculate the start of today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Set to start of the day

  // Fetch all records, only shows the id, name, and qr_id for the codes
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

  // Fetch the 5 recent records the user has entered
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

  // Fetch timesheets for the current pay period
  const payPeriodSheets = (await prisma.timeSheet
    .findMany({
      where: {
        userId: userid,
        start_time: { gte: payPeriodStart, lte: currentDate },
      },
      select: {
        start_time: true,
        duration: true,
      },
    })
    .then((sheets) =>
      sheets.filter((sheet) => sheet.duration !== null)
    )) as PayPeriodTimesheets[]; // Type casting

// created the data fot the client side component
  return (
    <Content
      session={session}
      locale={locale}
      jobCodes={jobCodes}
      CostCodes={costCodes}
      equipment={equipment}
      recentJobSites={recentJobSites}
      recentCostCodes={recentCostCodes}
      recentEquipment={recentEquipment}
      payPeriodSheets={payPeriodSheets}
    />
  );
}
