"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formId = parseInt(params.id);
    if (isNaN(formId)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const usersLogs = await prisma.employeeEquipmentLogs.findMany({
      where: {
        employeeId: userId,
        id: formId,
        createdAt: {
          lte: currentDate,
          gte: past24Hours,
        },
        isSubmitted: false,
      },
    });

    return NextResponse.json(usersLogs, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching users logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch users logs" },
      { status: 500 }
    );
  }
}
