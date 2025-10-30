import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ timeSheetId: string }> }
) {
  try {
    const { timeSheetId } = await params;

    // Get the TascoFLoads for this tascoLogId (note: timeSheetId param is actually tascoLogId)
    const fLoads = await prisma.tascoFLoads.findMany({
      where: {
        tascoLogId: timeSheetId,
      },
    });

    return NextResponse.json(fLoads || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching TascoFLoads:", error);
    return NextResponse.json(
      { error: "Failed to fetch TascoFLoads" },
      { status: 500 }
    );
  }
}