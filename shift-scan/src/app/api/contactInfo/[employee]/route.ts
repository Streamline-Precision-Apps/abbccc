"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { employee: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { employee } = params;

  try {
    // Fetch employee details
    const EmployeeData = await prisma.contacts.findUnique({
      where: {
        employeeId: employee.toString(),
      },
      select: {
        id: true,
        employeeId: true,
        phoneNumber: true,
        emergencyContact: true,
        emergencyContactNumber: true,
      },
    });

    // Return the fetched data as a response
    return NextResponse.json(EmployeeData);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
