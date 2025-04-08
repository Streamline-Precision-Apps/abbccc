import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  let session;

  // Handle authentication and ensure session exists
  try {
    session = await auth();
  } catch (error) {
    console.error("Authentication failed:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Query the user for the signature
    const signature = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        signature: true,
      },
    });

    // If no signature is found, return 404
    if (!signature) {
      return NextResponse.json(
        { error: "No signature found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(signature);
  } catch (error) {
    console.error("Error fetching signature:", error);
    return NextResponse.json(
      { error: "Failed to fetch signature" },
      { status: 500 }
    );
  }
}
