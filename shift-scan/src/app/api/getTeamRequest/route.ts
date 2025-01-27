"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  const manager = `${session?.user?.firstName} ${session?.user?.lastName}`;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch received requests based on `id` and `userId`
    const receivedContent = await prisma.timeOffRequestForm.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        employee: true,
      },
    });

    const receivedContentWManager = receivedContent.map((request) => ({
      manager: manager,
      ...request,
    }));

    return NextResponse.json(receivedContentWManager);
  } catch (error) {
    console.error("Error fetching Time Off Requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch time off requests" },
      { status: 500 }
    );
  }
}
