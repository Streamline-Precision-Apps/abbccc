"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId, firstName, lastName } = session.user;
    const manager = `${firstName} ${lastName}`;

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

    // Fetch timesheet entries
    const receivedContent = await prisma.timeSheets.findMany({
      where: {
        userId,
        startTime: {
          gte: payPeriodStart,
        },
        vehicleId: {
          not: null, // Exclude null vehicleId entries
        },
      },
    });

    console.log("Raw data fetched:", receivedContent);

    // Include manager info in the response
    const responseContent = receivedContent.map((entry) => ({
      manager,
      ...entry,
    }));

    return NextResponse.json(responseContent);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
