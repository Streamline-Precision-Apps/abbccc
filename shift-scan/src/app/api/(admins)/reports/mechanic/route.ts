import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }

  const userId = session?.user.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await prisma.timeSheet.findMany({
      select: {
        date: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        Maintenance: {
          select: {
            id: true,
            hours: true,
            description: true,
            Equipment: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Filter out timesheets with empty Maintenance arrays
    const filteredReport = report.filter(
      (item) => Array.isArray(item.Maintenance) && item.Maintenance.length > 0,
    );

    // Flatten the data to have one row per mechanic project
    const mechanicReport = filteredReport.flatMap((timesheet) =>
      timesheet.Maintenance.map((project) => ({
        id: project.id,
        employeeName: `${timesheet.User.firstName} ${timesheet.User.lastName}`,
        equipmentWorkedOn: project.Equipment?.name ?? "Unknown Equipment",
        hours: project.hours ?? 0,
        comments: project.description ?? "",
        dateWorked: timesheet.date,
      }))
    );

    if (!mechanicReport.length) {
      return NextResponse.json(
        { error: "No timesheets with MechanicProjects found" },
        { status: 404 },
      );
    }

    return NextResponse.json(mechanicReport);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching mechanic report:", error);
    return NextResponse.json(
      { error: "Failed to fetch mechanic report" },
      { status: 500 },
    );
  }
}