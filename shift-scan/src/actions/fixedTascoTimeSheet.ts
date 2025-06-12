"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
const { formatISO } = require("date-fns");
import { revalidatePath } from "next/cache";

/**
 * Fixed version of handleTascoTimeSheet that properly handles equipment connections
 * This fixes the "No 'Equipment' record(s) was found for a nested connect" error
 */
export async function handleTascoTimeSheet(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized user");
    }
    console.log("Handle Tasco TimeSheet:", formData);
    let newTimeSheet: string | null = null;
    
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Step 1: Create a new TimeSheet
      const jobsiteId = formData.get("jobsiteId") as string;
      const userId = formData.get("userId") as string;
      const equipmentId = formData.get("equipment") as string;
      const previousTimeSheetComments = formData.get("timeSheetComments") as string;
      const costCode = formData.get("costcode") as string;
      const shiftType = formData.get("shiftType") as string;
      const type = formData.get("type") as string;

      // Handle material type
      let materialType;
      const laborType = formData.get("laborType") as string;
      if (shiftType === "ABCD Shift") {
        materialType = formData.get("materialType") as string;
      } else {
        materialType = undefined;
      }

      // Log the equipment ID for debugging
      console.log("Equipment ID for connection:", equipmentId);

      // Create TascoLog create data without equipment initially
      let tascoLogCreateData: any = {
        shiftType,
        laborType
      };

      // Add material type connection if available
      if (materialType) {
        tascoLogCreateData.TascoMaterialTypes = { 
          connect: { name: materialType } 
        };
      }

      // Only add equipment if we have an equipment ID
      if (equipmentId) {
        // Try to find equipment by either ID or QR code
        const equipment = await prisma.equipment.findFirst({
          where: {
            OR: [
              { id: equipmentId },
              { qrId: equipmentId }
            ]
          }
        });

        if (equipment) {
          console.log("Found equipment:", equipment);
          // Use the actual equipment ID for the connection
          tascoLogCreateData.equipmentId = equipment.id;
        } else {
          console.warn(`No equipment found with ID: ${equipmentId}`);
          // Continue without equipment connection
        }
      }

      // Create the TimeSheet with TascoLog
      const createdTimeSheet = await prisma.timeSheet.create({
        data: {
          date: formatISO(formData.get("date") as string),
          Jobsite: { connect: { id: jobsiteId } },
          User: { connect: { id: userId } },
          CostCode: { connect: { name: costCode } },
          startTime: formatISO(formData.get("startTime") as string),
          workType: "TASCO",
          TascoLogs: { create: tascoLogCreateData }
        },
      });

      console.log("New TimeSheet created:", createdTimeSheet);
      newTimeSheet = createdTimeSheet.id;

      // Step 2: If type is "switchJobs", end the previous TimeSheet
      if (type === "switchJobs") {
        const previousTimeSheetId = formData.get("id") as string;
        if (!previousTimeSheetId) {
          throw new Error("No valid previous TimeSheet ID found.");
        }

        // Update the previous TimeSheet to set the end time
        await prisma.timeSheet.update({
          where: { id: previousTimeSheetId },
          data: {
            endTime: formatISO(formData.get("endTime") as string),
            comment: previousTimeSheetComments,
          },
        });

        console.log("Previous TimeSheet ended:", previousTimeSheetId);
      }

      // Revalidate paths
      revalidatePath("/");
      revalidatePath("/dashboard");
    });

    return newTimeSheet;
  } catch (error) {
    console.error("Error in transaction:", error);
    throw error;
  }
}
