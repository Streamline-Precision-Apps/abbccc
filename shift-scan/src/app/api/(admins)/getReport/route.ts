import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ✅ No "use server" needed in API routes

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    // Example API call: /api/getReport?page=timesheets&startDate=2024-12-01&endDate=2024-12-31
    const page = url.searchParams.get("page");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Validate parameters
    if (!page) {
      return NextResponse.json({ error: "Page parameter is required" }, { status: 400 });
    }

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    // Convert start and end dates
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    if (start > end) {
      return NextResponse.json({ error: "Start date cannot be after end date" }, { status: 400 });
    }

    if (page === "timesheets") {
      const timesheetData = await prisma.timeSheet.findMany({
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
      });

      if (!timesheetData || timesheetData.length === 0) {
        return NextResponse.json(
          { message: "No timesheets found for the given date range." },
          { status: 404 }
        );
      }

      return NextResponse.json(timesheetData);
    }

    return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching data:", error);

    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
