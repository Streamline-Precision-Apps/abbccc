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

    // Fetch the 5 most recent unique cost codes for the authenticated user
    const recentCostCodes = await prisma.timeSheet.groupBy({
      by: ["costcode"],
      where: {
        userId: userId,
      },
      orderBy: {
        _max: {
          date: "desc",
        },
      },
      take: 5,
      _max: {
        date: true,
      },
    });

    if (!recentCostCodes || recentCostCodes.length === 0) {
      return NextResponse.json(
        { message: "No recent cost codes found." },
        { status: 404 }
      );
    }

    // Fetch full cost code details based on the grouped costCode names
    const costCodeDetails = await Promise.all(
      recentCostCodes.map(async (log) => {
        if (log.costcode) {
          return prisma.costCode.findUnique({
            where: { name: log.costcode },
            select: {
              id: true,
              name: true,
            },
          });
        }
        return null;
      })
    );

    // Filter out any null values if no matching cost codes are found
    const filteredCostCodeDetails = costCodeDetails.filter(Boolean);

    if (filteredCostCodeDetails.length === 0) {
      return NextResponse.json(
        { message: "No matching cost codes found in database." },
        { status: 404 }
      );
    }

    return NextResponse.json(filteredCostCodeDetails);
  } catch (error) {
    console.error("Error fetching recent cost codes:", error);

    let errorMessage = "Failed to fetch recent cost codes";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
