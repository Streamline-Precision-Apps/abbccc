"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const filter = url.searchParams.get("filter");
    const today = new Date();

    let whereClause = {};
    let orderByClause = { requestedStartDate: "desc" as const };

    switch (filter) {
      case "all":
        break; // No `where` clause, fetch all records.
      case "pending":
        whereClause = { status: "PENDING" };
        break;
      case "approved":
        whereClause = { status: "APPROVED", requestedEndDate: { gte: today } };
        orderByClause = { createdAt: "desc" };
        break;
      case "denied":
        whereClause = { status: "DENIED", requestedEndDate: { gte: today } };
        break;
      case "archived-denied":
        whereClause = { status: "DENIED", requestedEndDate: { lte: today } };
        break;
      case "archived-approved":
        whereClause = { status: "APPROVED", requestedEndDate: { lte: today } };
        break;
      case "all-archived":
        whereClause = { requestedEndDate: { lte: today } };
        break;
      default:
        return NextResponse.json({ error: "Invalid filter" }, { status: 400 });
    }

    const sentContent = await prisma.timeOffRequestForm.findMany({
      where: whereClause,
      orderBy: orderByClause,
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

    if (!sentContent || sentContent.length === 0) {
      return NextResponse.json(
        { message: "No time off requests found for the given filter." },
        { status: 404 }
      );
    }

    return NextResponse.json(sentContent);
  } catch (error) {
    console.error("Error fetching Time Off Requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch time off requests" },
      { status: 500 }
    );
  }
}
