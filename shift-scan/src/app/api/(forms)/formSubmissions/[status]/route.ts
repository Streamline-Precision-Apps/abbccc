"use server";
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
  { params }: { params: { status: string } }
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = params;
  const { searchParams } = new URL(req.url);
  const skip = parseInt(searchParams.get("skip") || "0"); // Number of records to skip
  const take = parseInt(searchParams.get("take") || "10"); // Number of records to fetch

  // Define the type for whereClause
  let whereClause: {
    userId: string;
    status?: FormStatus | { not: FormStatus };
  } = { userId };

  if (status === "pending") {
    whereClause = { ...whereClause, status: FormStatus.PENDING };
  } else if (status === "approved") {
    whereClause = { ...whereClause, status: FormStatus.APPROVED };
  } else if (status === "denied") {
    whereClause = { ...whereClause, status: FormStatus.DENIED };
  } else if (status === "all") {
    whereClause = { ...whereClause };
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
      { status: 500 }
    );
  }
}
