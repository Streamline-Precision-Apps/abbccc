"use server";
import prisma from "@/lib/prisma";
import {
  FormStatus,
  TimeOffRequestType,
  Permission,
  WorkType,
} from "@/lib/types";
import { user } from "@nextui-org/theme";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

export async function deletePersonnel(id: string) {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
    revalidateTag("employees");
    revalidatePath("/admins/personnel");
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function changeCrewLead(crewId: string, userId: string) {
  try {
    console.log("Changing crew lead...");
    console.log(crewId, userId);
    await prisma.crew.update({
      where: { id: crewId },
      data: {
        leadId: userId,
      },
    });
    revalidateTag("employees");
    revalidateTag("crews");
    revalidatePath("/admins/personnel");
    return true;
  } catch (error) {
    console.error("Error changing crew lead:", error);
    throw new Error("Failed to change crew lead");
  }
}

export async function removeCrewLead(crewId: string) {
  try {
    await prisma.crew.update({
      where: { id: crewId },
      data: {
        leadId: "", // Empty string since null isn't allowed
      },
    });
    revalidateTag("employees");
    revalidateTag("crews");
    revalidatePath("/admins/personnel");
    return true;
  } catch (error) {
    console.error("Error removing crew lead:", error);
    throw new Error("Failed to remove crew lead");
  }
}
