
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/clockoutDetails
 * Returns all relevant data for the clock-out process in one response.
 */
export async function GET() {
  try {
    // Authenticate user
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all required data in parallel
    const [timesheets, user] = await Promise.all([
      prisma.timeSheet.findMany({
        where: {
          userId,
          startTime: { gte: startOfDay, lte: endOfDay },
        },
        include: {
          Jobsite: true,
          TascoLogs: true,
          TruckingLogs: true,
        },
        orderBy: { startTime: 'desc' },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { signature: true },
      }),
    ]);

    // Get the latest timesheet's comment (if any)
    const latestComment = timesheets.length > 0 ? timesheets[0].comment || '' : '';
    const signature = user?.signature || '';

    return NextResponse.json({
      timesheets,
      comment: latestComment,
      signature,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in /api/clockoutDetails:', error);
    return NextResponse.json({ error: 'Failed to fetch clock-out details' }, { status: 500 });
  }
}
