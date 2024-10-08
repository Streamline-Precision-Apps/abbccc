"use server";

import prisma from "@/lib/prisma";
import { FormStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { start } from "repl";

export async function getUserSentContent(user_id: string | undefined) {
  if (!user_id) return;
  const sentContent = await prisma.timeoffRequestForms.findMany({
    where: {
      employeeId: user_id,
    },
  });
  return sentContent;
}
export async function createLeaveRequest(formData: FormData) {
  // do we want to restrict the amount of requests that can be made?
  // do we want  to check if the user has a pending request already that match the dates and type of request
  try {
    console.log(formData);
    const userId = formData.get("userId") as string;
    const requestType = formData.get("requestType") as string;
    const status = formData.get("status") as string;

    if (status) {
      const result = await prisma.timeoffRequestForms.create({
        data: {
          date: new Date(formData.get("date") as string),
          requestedStartDate: new Date(formData.get("startDate") as string),
          requestedEndDate: new Date(formData.get("endDate") as string),
          requestType: requestType,
          comment: formData.get("description") as string,
          managerComment: null,
          status: status as FormStatus,
          employeeId: userId,
        },
      });
      console.log(result);
      revalidatePath("/hamburger/inbox");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function EditLeaveRequest(formData: FormData) {
  try {
    console.log(formData);
    const id = formData.get("id") as string;
    const userId = formData.get("userId") as string;
    const requestType = formData.get("requestType") as string;
    const status = formData.get("status") as string;
    const today = new Date();

    // Parse the start and end dates as local dates to avoid timezone shift
    const startDateString = formData.get("startDate") as string;
    const endDateString = formData.get("endDate") as string;

    const startDate = new Date(`${startDateString}T00:00:00`);
    const endDate = new Date(`${endDateString}T00:00:00`);

    console.log(startDate, endDate);

    const result = await prisma.timeoffRequestForms.update({
      where: { id: Number(id) },
      data: {
        date: new Date(today),
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
      const result = await prisma.timeoffRequestForms.update({
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
    await prisma.timeoffRequestForms.delete({
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
