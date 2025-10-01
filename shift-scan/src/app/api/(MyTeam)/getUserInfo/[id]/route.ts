import { NextResponse, NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing or invalid user ID" },
        { status: 400 },
      );
    }

    const userId = id;

    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the employee and related contact information
    const employee = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        DOB: true,
        image: true,
        Contact: {
          select: {
            phoneNumber: true,
            emergencyContact: true,
            emergencyContactNumber: true,
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    const contact = employee.Contact;
    const employeeData = {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      DOB: employee.DOB,
      image: employee.image,
    };
    const data = { employeeData, contact };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching employee data:", error);

    let errorMessage = "Failed to fetch employee data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
