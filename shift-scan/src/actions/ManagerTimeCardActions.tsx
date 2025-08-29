"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

export async function ApproveUsersTimeSheets(formData: FormData) {
  const id = formData.get("id") as string;
  const statusComment = formData.get("statusComment") as string;
  const timesheetIdsString = formData.get("timesheetIds") as string;
  const stringIds = JSON.parse(timesheetIdsString) as number[];
  const timesheetIds = stringIds.map((id) => id);

  try {
    // Update all matching timesheets with the same values
    await prisma.timeSheet.updateMany({
      where: {
        id: { in: timesheetIds }, // Use 'in' operator for multiple IDs
        userId: id,
      },
      data: {
        status: "APPROVED",
        statusComment, // Same comment for all
      },
    });

    revalidatePath("/dashboard/myTeam/timecards");
    return { success: true };
  } catch (error) {
    console.error("Error updating timesheets:", error);
    return { success: false, error: "Failed to update timesheets" };
  }
}
