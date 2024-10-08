"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract query parameters
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    // Find the crews that the current user supervises
    const supervisedCrews = await prisma.crewMembers.findMany({
      where: {
        employeeId: userId,
        supervisor: true, // Make sure the user is a supervisor
      },
      select: {
        crewId: true, // Only select the crewId for further querying
      },
    });

    // Extract crew IDs from the results
    const crewIds = supervisedCrews.map((crewMember) => crewMember.crewId);

    if (type === "sent") {
      const today = new Date();
      // Fetch time-off requests sent by the current user
      const sentContent = await prisma.timeoffRequestForms.findMany({
        where: {
          employeeId: userId,
          requestedEndDate: {
            gte: today, // any request later then today will be gone
          },
        },
      });

      return NextResponse.json(sentContent);
    }

    if (type === "received") {
      // Fetch time-off requests from employees of the crews managed by the current user
      const receivedContent = await prisma.timeoffRequestForms.findMany({
        where: {
          employee: {
            crewMembers: {
              some: {
                crewId: { in: crewIds }, // Only include requests from managed crews
              },
            },
          },
          status: "PENDING", // Only fetch PENDING requests
        },
      });

      return NextResponse.json(receivedContent);
    }

    // If type is not recognized, return an error
    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching Time Off Requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch time off requests" },
      { status: 500 }
    );
  }
}
