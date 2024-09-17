import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Content from "@/app/(content)/content";
import { PayPeriodTimesheets } from "@/lib/types";
import { auth } from "@/auth"
import getUser from "@/utils/getSession-Server";

export default async function Home() {
// Get the current user and checks if the user is authenticated
const session = await getUser();
const userId = session.id;

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

  // Fetch the 5 recent records the user has entered
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

  // Fetch timesheets for the current pay period
  const payPeriodSheets = (await prisma.timeSheets
    .findMany({
      where: {
        userId: userId,
        startTime: { gte: payPeriodStart, lte: currentDate },
      },
      select: {
        startTime: true,
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
      costCodes={costCodes}
      equipment={equipment}
      recentJobSites={recentJobSites}
      recentCostCodes={recentCostCodes}
      recentEquipment={recentEquipment}
      payPeriodSheets={payPeriodSheets} 
      logs={[]}    
      />
  );
}
