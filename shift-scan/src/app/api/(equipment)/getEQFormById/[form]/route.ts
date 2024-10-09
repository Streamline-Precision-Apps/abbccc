"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { form: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse form ID as a number
    const formId = parseInt(params.form);
    if (isNaN(formId)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    // Get the current date
    const currentDate = new Date();
    // Find past 24 hours
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    // Get the equipment form based on form ID
    const equipmentform = await prisma.employeeEquipmentLogs.findUnique({
      where: {
        id: formId,
      },
      include: {
        Equipment: true,
      },
    });

    if (!equipmentform) {
      return NextResponse.json(
        { error: "Equipment form not found" },
        { status: 404 }
      );
    }

    // Get user notes from the equipment log
    const userNotes = await prisma.employeeEquipmentLogs.findUnique({
      where: {
        id: formId,
      },
    });

    return NextResponse.json(
      { equipmentform, userNotes },
      {
        headers: {
          "Cache-Control":
            "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
