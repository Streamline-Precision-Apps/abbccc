"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch contact details
    const contacts = await prisma.contacts.findUnique({
      where: {
        employeeId: userId.toString(),
      },
      select: {
        phoneNumber: true,
        emergencyContact: true,
        emergencyContactNumber: true,
      },
    });

    // Return the fetched data as a response
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
