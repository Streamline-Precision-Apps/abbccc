
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * Get list of equipment for clock operations
 * Returns only active, available equipment that is not disabled by admin
 */
export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const equipment = await prisma.equipment.findMany({
      where: {
        isDisabledByAdmin: false,
        state: "AVAILABLE",
        approvalStatus: "APPROVED",
      },
      select: {
        id: true,
        qrId: true,
        name: true,
        state: true,
      },
      orderBy: {
        name: "asc",
      },
    });


    return NextResponse.json(equipment);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching equipment:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch equipment data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
