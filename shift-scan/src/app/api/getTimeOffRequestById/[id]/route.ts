"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch sent requests based on `id` and `userId`
    const sentContent = await prisma.timeOffRequestForm.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
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
