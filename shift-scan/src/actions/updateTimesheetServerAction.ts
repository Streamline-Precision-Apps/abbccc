"use server";
import prisma from '@/lib/prisma';

/**
 * Server action to update a timesheet by ID with only the changed fields.
 * @param id Timesheet ID
 * @param changes Object with changed fields and their new values
 */
export async function updateTimesheetServerAction(id: string, changes: Record<string, any>) {
  if (!id || !changes || Object.keys(changes).length === 0) {
    return { error: 'Missing timesheet id or no changes provided.' };
  }
  try {
    const updated = await prisma.timeSheet.update({
      where: { id },
      data: changes,
    });
    return { success: true, timesheet: updated };
  } catch (error: any) {
    return { error: error.message || 'Failed to update timesheet.' };
  }
}
