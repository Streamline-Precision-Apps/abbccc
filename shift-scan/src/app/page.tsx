import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Content from "@/app/(content)/content";
import { PayPeriodTimesheets } from "@/lib/types";
import { auth } from "@/auth";


export default async function Home() {
//------------------------------------------------------------------------
// Authentication

// Get the current user and checks if the user is authenticated
const session = await auth();
if (!session) {
  // Redirect or return an error if the user is not authenticated
  return { redirect: { destination: '/signin', permanent: false } };
}
// passes the session to the content component

//------------------------------------------------------------------------
const userId = session.user.id;

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
      payPeriodSheets={payPeriodSheets} 
      logs={[]}    
      />
  );
}
