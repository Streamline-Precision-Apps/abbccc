"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the ID parameter
    const jobsiteId = params.id;
    if (!jobsiteId) {
      return NextResponse.json({ error: "Invalid or missing jobsite ID" }, { status: 400 });
    }

    // Fetch jobsite data
    const jobsiteData = await prisma.jobsite.findUnique({
      where: { id: jobsiteId },
    });

    if (!jobsiteData) {
      return NextResponse.json({ error: "Jobsite not found" }, { status: 404 });
    }

    return NextResponse.json(jobsiteData);
  } catch (error) {
    console.error("Error fetching jobsite data:", error);

    let errorMessage = "Failed to fetch jobsite data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
