import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get summary information of all equipment (just id and name)
 * Used for lightweight equipment listing in admin assets page
 */
export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch only essential fields from equipment
    const equipmentSummary = await prisma.equipment.findMany({
      select: {
        id: true,
        name: true,
        approvalStatus: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!equipmentSummary || equipmentSummary.length === 0) {
      return NextResponse.json(
        { message: "No equipment found." },
        { status: 404 }
      );
    }

    return NextResponse.json(equipmentSummary);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching equipment summary:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to fetch equipment summary';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
