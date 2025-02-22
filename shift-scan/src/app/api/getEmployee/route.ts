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
    // Fetch employee details
    const employee = await prisma.user.findUnique({
      where: {
        id: userId.toString(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        signature: true,
        contact: {
          select: {
            phoneNumber: true,
            emergencyContact: true,
            emergencyContactNumber: true,
          },
        }
      },
    });

    // Return the fetched data as a response
    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
