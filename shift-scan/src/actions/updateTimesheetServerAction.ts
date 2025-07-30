"use server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function updateTimesheetServerAction(formData: FormData) {
  console.log(formData);
  const id = formData.get("id") as string;
  const startTime = new Date(formData.get("startTime") as string).toISOString();
  const endTime =
    new Date(formData.get("endTime") as string).toISOString() || null;
  const jobsite = formData.get("Jobsite") as string;
  const costCode = formData.get("CostCode") as string;

  try {
    const updated = await prisma.timeSheet.update({
      where: { id },
      data: {
        startTime,
        endTime: endTime || null,
        jobsiteId: jobsite,
        costcode: costCode,
      },
    });
    if (!updated) {
      return { error: "Failed to update timesheet." };
    }
    console.log("Updated timesheet:", updated);
    revalidateTag("timesheet");
    return { success: true, timesheet: updated };
  } catch (error) {
    let message = "Failed to update timesheet.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}
