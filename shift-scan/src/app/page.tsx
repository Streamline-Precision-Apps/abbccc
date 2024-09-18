import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Content from "@/app/(content)/content";
import { auth } from "@/auth";

export default async function Home() {
  //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    return { redirect: { destination: '/signin', permanent: false } };
  }

  const userId = session.user.id;

  // Get the current language from cookies
  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en";

  // Calculate the current pay period start
  const calculatePayPeriodStart = () => {
    const startDate = new Date(2024, 7, 5); // August 5, 2024
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    const diffWeeks = Math.floor(diff / (2 * 7 * 24 * 60 * 60 * 1000)); // Two-week intervals
    return new Date(
      startDate.getTime() + diffWeeks * 2 * 7 * 24 * 60 * 60 * 1000
    );
  };

  const payPeriodStart = calculatePayPeriodStart();
  const currentDate = new Date();

  // Fetch timesheets for the current pay period from Prisma
  const payPeriodSheets = await prisma.timeSheets.findMany({
    where: {
      userId: userId,
      startTime: { gte: payPeriodStart, lte: currentDate },
    },
    select: {
      startTime: true,
      duration: true,
    },
  });

  // Pass the fetched data to the client-side Content component
  return (
    <Content
      session={session}
      locale={locale}
      payPeriodSheets={payPeriodSheets}
      logs={[]}  // Example extra prop
    />
  );
}