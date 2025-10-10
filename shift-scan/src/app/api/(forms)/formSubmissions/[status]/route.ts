import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ status: string }> },
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await params;
  const { searchParams } = new URL(req.url);
  const skip = parseInt(searchParams.get("skip") || "0"); // Number of records to skip
  const take = parseInt(searchParams.get("take") || "10"); // Number of records to fetch

  // Get date filter parameters
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const weekFilter = searchParams.get("week") === "true";

  // Process date filters
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (startDateParam) {
    startDate = new Date(startDateParam);
  }

  if (endDateParam) {
    endDate = new Date(endDateParam);
  }

  // If week filter is true, calculate the current week's start and end dates
  if (weekFilter) {
    const today = new Date();
    // Get the first day of the week (Sunday)
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay());
    firstDay.setHours(0, 0, 0, 0);

    // Get the last day of the week (Saturday)
    const lastDay = new Date(today);
    lastDay.setDate(today.getDate() + (6 - today.getDay()));
    lastDay.setHours(23, 59, 59, 999);

    startDate = firstDay;
    endDate = lastDay;
  }

  // Define the type for whereClause
  let whereClause: {
    userId: string;
    createdAt?: { gte: Date; lte: Date };
    status?: FormStatus | { not: FormStatus };
  } = { userId }; // Always filter by current user's ID

  if (status === "pending") {
    whereClause = { ...whereClause, status: FormStatus.PENDING };
  } else if (status === "approved") {
    whereClause = { ...whereClause, status: FormStatus.APPROVED };
  } else if (status === "denied") {
    whereClause = { ...whereClause, status: FormStatus.DENIED };
  } else if (status === "draft") {
    whereClause = { ...whereClause, status: FormStatus.DRAFT };
  } else if (status === "all") {
    // No status filter for "all", but apply date filters if provided
    if (startDate && endDate) {
      whereClause = {
        ...whereClause,
        createdAt: { gte: startDate, lte: endDate },
      };
    }
  }

  try {
    const forms = await prisma.formSubmission.findMany({
      where: whereClause,
      include: {
        FormTemplate: {
          select: {
            name: true,
            formType: true,
          },
        },
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      skip, // Skip the first `skip` records
      take, // Fetch `take` records
      orderBy: {
        createdAt: "desc", // Sort by submission date (newest first)
      },
    });

    forms.sort((a, b) => {
      if (a.status === FormStatus.DRAFT && b.status !== FormStatus.DRAFT)
        return -1;
      if (a.status !== FormStatus.DRAFT && b.status === FormStatus.DRAFT)
        return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Error fetching forms" },
      { status: 500 },
    );
  }
}
