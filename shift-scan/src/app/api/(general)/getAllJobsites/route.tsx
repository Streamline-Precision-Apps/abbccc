import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const filter = url.searchParams.get("filter");

    let jobsiteData = [];

    const selectFields = {
      CCTags: true,
      id: true,
      qrId: true,
      isActive: true,
      status: true,
      name: true,
      address: true,
      city: true,
      state: true,
      country: true,
      description: true,
      comment: true,
    };

    if (filter === "Temporary") {
      jobsiteData = await prisma.jobsite.findMany({
        // TODO: Uncomment this once the database schema includes a "TEMPORARY" status.
        // where: { status: "TEMPORARY" },
        select: selectFields,
      });
    } else if (filter === "Active") {
      jobsiteData = await prisma.jobsite.findMany({
        where: { isActive: true },
        select: selectFields,
      });
    } else if (filter === "Inactive") {
      jobsiteData = await prisma.jobsite.findMany({
        where: { isActive: false },
        select: selectFields,
      });
    } else {
      jobsiteData = await prisma.jobsite.findMany({
        select: selectFields,
      });
    }

    if (!jobsiteData || jobsiteData.length === 0) {
      return NextResponse.json(
        { message: "No jobsites found for the given filter." },
        { status: 404 }
      );
    }

    return NextResponse.json(jobsiteData);
  } catch (error) {
    console.error("Error fetching jobsite data:", error);

    let errorMessage = "Failed to fetch jobsite data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
