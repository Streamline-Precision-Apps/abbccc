import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ✅ No "use server" needed in API routes

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    //api/getReport?page=timesheets&startDate=2024-12-01&endDate=2024-12-31
    const page = url.searchParams.get("page");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Validate parameters
    if (!page || !startDate || !endDate) {
      return NextResponse.json({ error: "Page not provided" }, { status: 400 });
    }

    if (page === "timesheets") {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);

      const timesheetData = await prisma.timeSheet.findMany({
        where: {
          date: {
            gte: start,
            lt: end,
          },
        },
      });

      return NextResponse.json(timesheetData);
    }
    return NextResponse.json("Page not found");
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
