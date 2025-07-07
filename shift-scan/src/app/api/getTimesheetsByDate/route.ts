import prisma from '@/lib/prisma';
import * as Sentry from '@sentry/nextjs';
import { TimesheetFilter } from '@/lib/types';
import { NextRequest } from 'next/server';

/**
 * GET /api/getTimesheetsByDate?employeeId=...&date=...&type=...&pendingOnly=...
 * Returns timesheet data for a given employee, date, and filter type.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const dateParam = searchParams.get('date');
    const type = searchParams.get('type') as TimesheetFilter | null;
    const pendingOnly = searchParams.get('pendingOnly') === 'true';

    if (!employeeId || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required query parameters.' }),
        { status: 400 }
      );
    }

    // Convert date string to a range for the day (midnight to 23:59:59.999)
    let start: Date | undefined = undefined;
    let end: Date | undefined = undefined;
    if (dateParam) {
      start = new Date(dateParam + 'T00:00:00.000Z');
      end = new Date(dateParam + 'T23:59:59.999Z');
    }

    let data: unknown = null;
    switch (type) {
      case 'timesheetHighlights':
        data = await prisma.timeSheet.findMany({
          where: {
            userId: employeeId,
            ...(pendingOnly
              ? { status: 'PENDING' }
              : dateParam
              ? { date: { gte: start, lte: end } }
              : {}),
          },
          include: {
            Jobsite: true,
          },
        });
        break;
      case 'truckingEquipmentHaulLogs':
        data = [
          {
            TruckingLogs: await prisma.truckingLog.findMany({
              where: {
                TimeSheet: {
                  userId: employeeId,
                  ...(pendingOnly
                    ? { status: 'PENDING' }
                    : dateParam
                    ? { date: { gte: start, lte: end } }
                    : {}),
                },
              },
              include: {
                EquipmentHauled: {
                  include: {
                    Equipment: true,
                    JobSite: true,
                  },
                },
                Equipment: true,
              },
            }),
          },
        ];
        break;
      case 'truckingMaterialHaulLogs':
        data = [
          {
            TruckingLogs: await prisma.truckingLog.findMany({
              where: {
                TimeSheet: {
                  userId: employeeId,
                  ...(pendingOnly
                    ? { status: 'PENDING' }
                    : dateParam
                    ? { date: { gte: start, lte: end } }
                    : {}),
                },
              },
              include: {
                Materials: true,
                Equipment: true,
              },
            }),
          },
        ];
        break;
      case 'truckingRefuelLogs':
        data = [
          {
            TruckingLogs: await prisma.truckingLog.findMany({
              where: {
                TimeSheet: {
                  userId: employeeId,
                  ...(pendingOnly
                    ? { status: 'PENDING' }
                    : dateParam
                    ? { date: { gte: start, lte: end } }
                    : {}),
                },
              },
              include: {
                RefuelLogs: true,
                Equipment: true,
              },
            }),
          },
        ];
        break;
      case 'truckingStateLogs':
        data = [
          {
            TruckingLogs: await prisma.truckingLog.findMany({
              where: {
                TimeSheet: {
                  userId: employeeId,
                  ...(pendingOnly
                    ? { status: 'PENDING' }
                    : dateParam
                    ? { date: { gte: start, lte: end } }
                    : {}),
                },
              },
              include: {
                StateMileages: true,
                Equipment: true,
              },
            }),
          },
        ];
        break;
      case 'tascoHaulLogs':
        data = [
          {
            TascoLogs: await prisma.tascoLog.findMany({
              where: {
                TimeSheet: {
                  userId: employeeId,
                  ...(pendingOnly
                    ? { status: 'PENDING' }
                    : dateParam
                    ? { date: { gte: start, lte: end } }
                    : {}),
                },
              },
              include: {
                Equipment: true,
                RefuelLogs: true,
              },
            }),
          },
        ];
        break;
      case 'tascoRefuelLogs':
        data = [
          {
            TascoLogs: await prisma.tascoLog.findMany({
              where: {
                TimeSheet: {
                  userId: employeeId,
                  ...(pendingOnly
                    ? { status: 'PENDING' }
                    : dateParam
                    ? { date: { gte: start, lte: end } }
                    : {}),
                },
              },
              include: {
                RefuelLogs: true,
                Equipment: true,
              },
            }),
          },
        ];
        break;
      case 'equipmentLogs':
        data = [
          {
            EmployeeEquipmentLogs: await prisma.employeeEquipmentLog.findMany({
              where: {
                TimeSheet: {
                  userId: employeeId,
                  ...(pendingOnly
                    ? { status: 'PENDING' }
                    : dateParam
                    ? { date: { gte: start, lte: end } }
                    : {}),
                },
              },
              include: {
                Equipment: true,
                RefuelLog: true,
              },
            }),
          },
        ];
        break;
      case 'equipmentRefuelLogs':
        data = [
          {
            EmployeeEquipmentLogs: await prisma.employeeEquipmentLog.findMany({
              where: {
                TimeSheet: {
                  userId: employeeId,
                  ...(pendingOnly
                    ? { status: 'PENDING' }
                    : dateParam
                    ? { date: { gte: start, lte: end } }
                    : {}),
                },
              },
              include: {
                RefuelLog: true,
                Equipment: true,
                // Jobsite: true, // Not a valid relation on EmployeeEquipmentLog
              },
            }),
          },
        ];
        break;
      case 'mechanicLogs':
        data = [
          {
            MaintenanceLogs: await prisma.maintenanceLog.findMany({
              where: {
                userId: employeeId,
                TimeSheet: {
                  ...(pendingOnly
                    ? { status: 'PENDING' }
                    : dateParam
                    ? { date: { gte: start, lte: end } }
                    : {}),
                },
              },
              include: {
                Maintenance: true,
                TimeSheet: true,
                User: true,
              },
            }),
          },
        ];
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid filter type.' }),
          { status: 400 }
        );
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500 }
    );
  }
}
