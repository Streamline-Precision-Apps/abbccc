import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userCrewData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        Crews: {
          select: {
            id: true,
            Users: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!userCrewData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const crew = userCrewData?.Crews?.[0]?.Users || [];

    return NextResponse.json(crew, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching user crew data:', error);

    let errorMessage = 'Failed to fetch user crew data';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
