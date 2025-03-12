"use server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  // Authentication handling with error handling
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }

  const manager = session?.user.permission;
  // Permission check with early return
  if (manager !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure params is available and the id is valid
  let userId;
  try {
    userId = (await params).id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing params:", error);
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    // Fetch the signature for the user
    const signature = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        signature: true,
      },
    });

    if (!signature) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(signature);
  } catch (error) {
    console.error("Error fetching user signature:", error);
    return NextResponse.json(
      { error: "Failed to fetch user signature" },
      { status: 500 }
    );
  }
}
