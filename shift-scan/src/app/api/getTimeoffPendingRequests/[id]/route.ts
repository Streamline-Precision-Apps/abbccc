"use server";

// we need this rout to search by the id of the sent request
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // Fetch sent requests based on `id` and `userId`
    const sentContent = await prisma.timeoffRequestForms.findMany({
      where: {
        id: Number(params.id),
        employeeId: userId,
      },
    });

    return NextResponse.json(sentContent);
  } catch (error) {
    console.error("Error fetching Time Off Requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch time off requests" },
      { status: 500 }
    );
  }
}
