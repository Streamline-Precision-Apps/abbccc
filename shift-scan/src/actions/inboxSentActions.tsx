"use server";

import prisma from "@/lib/prisma";
import { FormStatus, TimeOffRequestType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function EditLeaveRequest(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;

    const requestType = formData.get("requestType") as TimeOffRequestType;

    // Parse the start and end dates as local dates to avoid timezone shift
    const startDateString = formData.get("startDate") as string;
    const endDateString = formData.get("endDate") as string;

    const startDate = new Date(`${startDateString}T00:00:00`);
    const endDate = new Date(`${endDateString}T00:00:00`);

    console.log(startDate, endDate);

    await prisma.timeOffRequestForm.update({
      where: { id: Number(id) },
      data: {
        requestedStartDate: startDate,
        requestedEndDate: endDate,
        requestType: requestType,
        comment: formData.get("description") as string,
        status: "PENDING",
      },
    });

    revalidatePath("/hamburger/inbox");
  } catch (error) {
    console.log(error);
  }
}

export async function ManagerLeaveRequest(formData: FormData) {
  try {
    // Correct the form field names
    const managerComment = formData.get("mangerComments") as string;
    const status = formData.get("decision") as string;
    const name = formData.get("decidedBy") as string;
    const id = formData.get("id");

    console.log("Form Data:", { managerComment, status, name, id });

    if (id && status && managerComment) {
      // Perform the Prisma update
      const result = await prisma.timeOffRequestForm.update({
        where: { id: Number(id) },
        data: {
          managerComment: managerComment,
          status: status as FormStatus,
          decidedBy: name,
        },
      });

      console.log("Update Result:", result);

      // Revalidate the path to update the data
      revalidatePath("/hamburger/inbox");
    } else {
      console.error("Missing form data fields:", {
        id,
        status,
        managerComment,
      });
    }
  } catch (error) {
    console.error("Error in ManagerLeaveRequest:", error);
  }
}

// only a user should be able to delete a leave request
export async function DeleteLeaveRequest(
  id: string,
  userId: string | undefined
): Promise<boolean> {
  try {
    const deleteId = Number(id);

    // Perform the deletion
    await prisma.timeOffRequestForm.delete({
      where: {
        id: deleteId,
        employeeId: userId,
      },
    });

    // Revalidate cache to update the inbox view
    revalidatePath("/hamburger/inbox");

    // Return true if deletion was successful
    return true;
  } catch (error) {
    // Log any errors encountered during the deletion process
    console.error("Failed to delete request:", error);

    // Return false to indicate deletion failure
    return false;
  }
}
