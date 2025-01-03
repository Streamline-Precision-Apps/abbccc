"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const filter = url.searchParams.get("filter");
  const today = new Date();

  try {
    // Fetch sent requests based on `id` and `userId`
    if (filter === "all") {
      const sentContent = await prisma.timeOffRequestForm.findMany({
        where: {
          requestedEndDate: {
            gte: today,
          },
        },
        orderBy: {
          requestedStartDate: "desc",
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
      });
      return NextResponse.json(sentContent);
    } else if (filter === "pending") {
      const sentContent = await prisma.timeOffRequestForm.findMany({
        where: {
          status: "PENDING",
        },
        orderBy: {
          requestedStartDate: "desc",
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return NextResponse.json(sentContent);
    } else if (filter === "approved") {
      const sentContent = await prisma.timeOffRequestForm.findMany({
        where: {
          status: "APPROVED",
          requestedEndDate: {
            gte: today,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return NextResponse.json(sentContent);
    } else if (filter === "denied") {
      const sentContent = await prisma.timeOffRequestForm.findMany({
        where: {
          status: "DENIED",
          requestedEndDate: {
            gte: today,
          },
        },
        orderBy: {
          requestedStartDate: "desc",
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return NextResponse.json(sentContent);
    } else {
      return NextResponse.json({ error: "Invalid filter" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching Time Off Requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch time off requests" },
      { status: 500 }
    );
  }
}
