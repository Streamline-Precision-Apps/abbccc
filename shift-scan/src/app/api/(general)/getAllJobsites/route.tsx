import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
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

    // Create a cached function for fetching jobsites
    const getCachedJobsites = unstable_cache(
      async (filter: string | null) => {
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

        if (filter === "Temporary") {
          return await prisma.jobsite.findMany({
            where: { approvalStatus: "PENDING" },
            select: selectFields,
          });
        } else if (filter === "Active") {
          return await prisma.jobsite.findMany({
            where: { isActive: true },
            select: selectFields,
          });
        } else if (filter === "Inactive") {
          return await prisma.jobsite.findMany({
            where: { isActive: false },
            select: selectFields,
          });
        } else {
          return await prisma.jobsite.findMany({
            select: selectFields,
          });
        }
      },
      [filter || "all"],
      {
        tags: ["jobsites"],
        revalidate: 1800, // Cache for 30 minutes
      },
    );

    let jobsiteData = [];

    try {
      jobsiteData = await getCachedJobsites(filter);
    } catch (err) {
      // If Prisma throws due to a bad select field, log and return a clear error
      console.error("Prisma error in getAllJobsites:", err);
      return NextResponse.json(
        {
          error:
            "Invalid select fields in getAllJobsites. Check your Jobsite model and selectFields.",
        },
        { status: 500 },
      );
    }

    if (!jobsiteData || jobsiteData.length === 0) {
      return NextResponse.json(
        { message: "No jobsites found for the given filter." },
        { status: 404 },
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
