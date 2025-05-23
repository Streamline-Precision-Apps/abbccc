"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { employee: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { employee } = params;

    if (!employee) {
      return NextResponse.json(
        { error: "Missing or invalid employee ID" },
        { status: 400 }
      );
    }

    // Fetch employee details
    const EmployeeData = await prisma.contacts.findUnique({
      where: {
        userId: employee.toString(),
      },
      select: {
        id: true,
        userId: true,
        phoneNumber: true,
        emergencyContact: true,
        emergencyContactNumber: true,
      },
    });

    if (!EmployeeData) {
      return NextResponse.json(
        { error: "Employee contact details not found" },
        { status: 404 }
      );
    }

    // Return the fetched data as a response
    return NextResponse.json(EmployeeData, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);

    let errorMessage = "Failed to fetch profile data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
