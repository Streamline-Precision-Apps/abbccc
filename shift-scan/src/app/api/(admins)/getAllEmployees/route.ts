import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import * as Sentry from "@sentry/nextjs";
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

    // Create a cached function for fetching employees
    const getCachedEmployees = unstable_cache(
      async () => {
        return await prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            secondLastName: true,
            permission: true,
            truckView: true,
            mechanicView: true,
            laborView: true,
            tascoView: true,
            image: true,
            terminationDate: true,
          },
        });
      },
      ["all-employees"],
      {
        tags: ["employees"],
        revalidate: 1800, // Cache for 30 minutes
      }
    );

    const employees = await getCachedEmployees();

    if (!employees || employees.length === 0) {
      return NextResponse.json(
        { message: "No employees found." },
        { status: 404 },
      );
    }

    return NextResponse.json(employees);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching employees:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch employees";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
