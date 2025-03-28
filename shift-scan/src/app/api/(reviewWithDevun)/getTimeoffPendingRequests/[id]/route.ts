"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let session;
  
  // Authentication check
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Check if the ID is valid
  if (!params.id || typeof params.id !== "string") {
    return NextResponse.json({ error: "Invalid or missing request ID" }, { status: 400 });
  }

  try {
    // Fetch the time off request based on the provided ID
    const sentContent = await prisma.timeOffRequestForm.findUnique({
      where: {
        id: params.id,
      },
    });

    // Handle case where no time off request is found
    if (!sentContent) {
      return NextResponse.json({ error: "Time off request not found" }, { status: 404 });
    }

    return NextResponse.json(sentContent);
  } catch (error) {
    console.error("Error fetching Time Off Requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch time off requests" },
      { status: 500 }
    );
  }
}
