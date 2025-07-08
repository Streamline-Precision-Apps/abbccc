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
      Client: true,
      id: true,
      qrId: true,
      isActive: true,
      approvalStatus: true,
      name: true,
      Address: true, // This will return the related Address object if you want address info
      description: true,
      comment: true,
      creationReason: true,
      createdAt: true,
      updatedAt: true,
      archiveDate: true,
      clientId: true,
      createdById: true,
      createdVia: true,
    };

    // Defensive: Remove select fields that are not in the model
    // (Prisma will throw if you select a field that doesn't exist)
    // You can comment out or remove fields above if not in your schema

    try {
      if (filter === "Temporary") {
        jobsiteData = await prisma.jobsite.findMany({
          where: { approvalStatus: "PENDING" },
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
    } catch (err) {
      // If Prisma throws due to a bad select field, log and return a clear error
      console.error("Prisma error in getAllJobsites:", err);
      return NextResponse.json(
        {
          error:
            "Invalid select fields in getAllJobsites. Check your Jobsite model and selectFields.",
        },
        { status: 500 }
      );
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
