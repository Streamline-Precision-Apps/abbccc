import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch contact details
    const contacts = await prisma.contacts.findUnique({
      where: {
        userId: userId.toString(),
      },
      select: {
        phoneNumber: true,
        emergencyContact: true,
        emergencyContactNumber: true,
      },
    });

    if (!contacts) {
      return NextResponse.json(
        { message: "No contact details found." },
        { status: 404 }
      );
    }

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contact details:", error);

    let errorMessage = "Failed to fetch contact details";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
