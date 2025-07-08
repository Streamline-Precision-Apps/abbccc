import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TimeSheetStatus } from '@/lib/enums';

/**
 * API endpoint to fetch all PENDING timesheets for a list of user IDs.
 * Expects a POST request with a JSON body: { userIds: string[] }
 * Returns: { [userId: string]: TimeSheet[] }
 */
export async function POST(request: Request) {
  try {
    const { userIds } = await request.json();
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'userIds array required' }, { status: 400 });
    }    // Fetch all pending timesheets for all users in one query
    // Only include timesheets with an endTime (not null)
    const timesheets = await prisma.timeSheet.findMany({
      where: {
        userId: { in: userIds },
        status: 'PENDING',
        endTime: { not: null }, // Filter out timesheets without an endTime
      },
      include: {
        Jobsite: true,
        TascoLogs: true,
        TruckingLogs: true,
        EmployeeEquipmentLogs: true,
        MaintenanceLogs: true,
        // Add other relations as needed for your filters
      },
    });

    // Group timesheets by userId
    const grouped: Record<string, typeof timesheets> = {};
    userIds.forEach((id) => {
      grouped[id] = [];
    });
    timesheets.forEach((ts) => {
      if (grouped[ts.userId]) grouped[ts.userId].push(ts);
    });

    return NextResponse.json(grouped);
  } catch (error) {
    console.error('Error fetching pending team timesheets:', error);
    return NextResponse.json({ error: 'Failed to fetch pending team timesheets' }, { status: 500 });
  }
}
