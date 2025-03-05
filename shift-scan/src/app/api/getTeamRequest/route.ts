"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const managerId = session?.user?.id;

  if (!managerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch crews where the session user is the lead
    const managedCrews = await prisma.crew.findMany({
      where: { leadId: managerId },
      select: { id: true },
    });

    const managedCrewIds = managedCrews.map((crew) => crew.id);

    if (managedCrewIds.length === 0) {
      // If the user manages no crews, return an empty array
      return NextResponse.json([]);
    }

    // Get the current date in UTC
    const currentDate = new Date();

    // Fetch timeOffRequestForms for employees in managed crews
    const timeOffRequests = await prisma.timeOffRequestForm.findMany({
      where: {
        employee: {
          crews: {
            some: {
              id: { in: managedCrewIds },
            },
          },
        },
        requestedEndDate: {
          gte: currentDate, // Filter out past requests
        },
      },
      select: {
        id: true,
        status: true,
        employee: {
          select: {
            firstName: true,
            lastName: true,
            crews: {
              select: {
                leadId: true,
              },
            },
          },
        },
        requestType: true,
        requestedStartDate: true,
        requestedEndDate: true,
      },
    });

    console.log("Crew memebers timeOffRequests:", timeOffRequests);

    return NextResponse.json(timeOffRequests);
  } catch (error) {
    console.error("Error fetching Time Off Requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch time off requests" },
      { status: 500 }
    );
  }
}
