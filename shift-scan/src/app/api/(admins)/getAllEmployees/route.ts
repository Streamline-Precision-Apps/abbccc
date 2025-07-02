import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        permission: true,
        DOB: true,
        truckView: true,
        mechanicView: true,
        laborView: true,
        tascoView: true,
        image: true,
        terminationDate: true,
        accountSetup: true,
      },
    });

    if (!employees || employees.length === 0) {
      return NextResponse.json(
        { message: "No employees found." },
        { status: 404 }
      );
    }

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch employees";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
