"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract query parameters
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type === "sent") {
      const sentContent = await prisma.timeoffRequestForms.findMany({
        where: {
          employeeId: userId,
        },
      });

      return NextResponse.json(sentContent);
    }

    if (type === "received") {
      const receivedContent = await prisma.timeoffRequestForms.findMany({
        where: {
          status: "PENDING",
        },
      });

      return NextResponse.json(receivedContent);
    }

    // If type is not recognized, return an error
    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching Time Off Requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch time off requests" },
      { status: 500 }
    );
  }
}
