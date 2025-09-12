import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET handler for fetching a crew and its users by crew ID (admin access).
 * @param request - The incoming HTTP request object.
 * @param params - Route parameters containing the crew ID.
 * @returns JSON response with crew and user data, or error message.
 */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<ReturnType<typeof NextResponse.json>> => {
  try {
    const { id } = await params;

    // Fetch crew by ID, including users
    const userCrewData = await prisma.crew.findUnique({
      where: {
        id,
      },
      include: {
        Users: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            secondLastName: true,
          },
        },
      },
    });
    return NextResponse.json(userCrewData, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    // eslint-disable-next-line no-console
    console.error("Error fetching crews:", error);
    let errorMessage = "Failed to fetch crews";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
