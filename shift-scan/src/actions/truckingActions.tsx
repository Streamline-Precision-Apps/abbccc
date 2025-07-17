"use server";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { revalidatePath, revalidateTag } from "next/cache";

/* EQUIPMENT Hauled */
//------------------------------------------------------------------
//------------------------------------------------------------------

export async function createEquipmentHauled(formData: FormData) {
  console.log("Creating hauling logs...");
  console.log(formData);
  const truckingLogId = formData.get("truckingLogId") as string;

  const equipmentHauled = await prisma.equipmentHauled.create({
    data: {
      TruckingLog: {
        connect: { id: truckingLogId },
      },
    },
  });

  console.log(equipmentHauled);
  revalidatePath("/dashboard/truckingAssistant");
  revalidateTag("equipmentHauled");
  return equipmentHauled;
}

export async function createTruckLaborLogs(formData: FormData) {
  console.log("Creating Truck Labor Logs...");
  console.log(formData);
  const truckingLogId = formData.get("truckingLogId") as string;

  const truckLaborLogs = await prisma.truckLaborLogs.create({
    data: {
      truckingLogId: truckingLogId,
      type: "",
      startTime: new Date(),
      endTime: null,
    },
  });

  console.log(truckLaborLogs);
  revalidatePath("/dashboard/truckingAssistant");
  revalidateTag("equipmentHauled");
  return {
    ...truckLaborLogs,
    startTime: format(truckLaborLogs.startTime, "HH:mm"), // Return just time
  };
}

export async function updateLaborType(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const type = formData.get("type") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string | null;

    // Validate required fields
    if (!id) {
      throw new Error("Missing labor log ID");
    }

    // Prepare update data
    const updateData: {
      type?: string;
      startTime?: string;
      endTime?: string | null;
    } = {};

    if (type !== null) updateData.type = type;
    if (startTime) updateData.startTime = new Date(startTime).toISOString();
    if (endTime !== null) {
      updateData.endTime = endTime ? new Date(endTime).toISOString() : null;
    }

    // Perform the update
    const updatedLog = await prisma.truckLaborLogs.update({
      where: { id },
      data: updateData,
    });

    // Revalidate
    revalidatePath("/dashboard/truckingAssistant");
    revalidateTag("truckLaborLogs");

    return updatedLog;
  } catch (error) {
    console.error("Error updating labor type:", error);
    throw error; // Rethrow to handle in the UI component
  }
}

export async function updateEquipmentLogsLocation(formData: FormData) {
  console.log("Updating hauling logs...");
  console.log(formData);
  const id = formData.get("id") as string;
  const jobSiteId = formData.get("jobSiteId") as string;
  const truckingLogId = formData.get("truckingLogId") as string;
  const name = formData.get("jobSiteName") as string;

  // First check if jobSite exists
  const jobSiteExists = await prisma.jobsite.findUnique({
    where: { qrId: jobSiteId, name },
    select: { id: true },
  });

  if (!jobSiteExists) {
    throw new Error(`Jobsite with ID ${jobSiteId} not found`);
  }

  // Use a nested update to update the related Equipment's jobsiteId in one call.
  const updatedLog = await prisma.equipmentHauled.update({
    where: { id },
    data: {
      truckingLogId,
      jobSiteId: jobSiteExists.id,
    },
  });
  // Create EquipmentLocationLog for the updated jobSiteId

  console.log(updatedLog);
  revalidateTag("equipmentHauled");
  revalidatePath("/dashboard/truckingAssistant");
  return updatedLog;
}

export async function updateEquipmentLogsEquipment(formData: FormData) {
  console.log("Updating hauling logs...");
  console.log(formData);
  const id = formData.get("id") as string;
  const equipmentQrId = formData.get("equipmentId") as string;
  const truckingLogId = formData.get("truckingLogId") as string;

  // First check if equipment exists, using qrId to find it
  const equipmentExists = await prisma.equipment.findUnique({
    where: { qrId: equipmentQrId },
  });

  if (!equipmentExists) {
    throw new Error(`Equipment with QR ID ${equipmentQrId} not found`);
  }

  // Then proceed with update, using the actual equipment's id for the relationship
  const updatedLog = await prisma.equipmentHauled.update({
    where: { id },
    data: {
      truckingLogId,
      equipmentId: equipmentExists.id, // Use equipment's id, not qrId
    },
  });

  revalidateTag("equipmentHauled");
  revalidatePath("/dashboard/truckingAssistant");
  return updatedLog;
}

export async function deleteEquipmentHauled(id: string) {
  console.log("Deleting Equipment hauling logs...");
  console.log(id);
  await prisma.equipmentHauled.delete({
    where: { id },
  });

  revalidateTag("equipmentHauled");
  return true;
}

/* MATERIALS Hauled */
//------------------------------------------------------------------
//------------------------------------------------------------------

export async function createHaulingLogs(formData: FormData) {
  console.log("Creating hauling logs...");
  console.log(formData);
  const truckingLogId = formData.get("truckingLogId") as string;
  const name = formData.get("name") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const createdAt = new Date().toISOString();

  const haulingLog = await prisma.material.create({
    data: {
      truckingLogId,
      name,
      quantity,
      createdAt,
    },
  });

  console.log(haulingLog);
  revalidatePath("/dashboard/truckingAssistant");
  return haulingLog;
}

export async function updateHaulingLogs(formData: FormData) {
  console.log("Updating Material hauling logs...");
  const LoadType: {
    UNSCREENED: "UNSCREENED";
    SCREENED: "SCREENED";
  } = {
    UNSCREENED: "UNSCREENED",
    SCREENED: "SCREENED",
  };
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const LocationOfMaterial = formData.get("LocationOfMaterial") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const truckingLogId = formData.get("truckingLogId") as string;

  const materialWeight = parseFloat(formData.get("materialWeight") as string);
  // TODO: These fields don't exist in current database schema - temporarily commented out
  // const lightWeight = parseFloat(formData.get("lightWeight") as string);
  // const grossWeight = parseFloat(formData.get("grossWeight") as string);
  const loadTypeString = formData.get("loadType") as string;

  let loadType = null;
  if (!loadTypeString) {
    loadType = null;
  } else if (loadTypeString === "UNSCREENED") {
    loadType = LoadType.UNSCREENED;
  } else if (loadTypeString === "SCREENED") {
    loadType = LoadType.SCREENED;
  }

  // If ID is provided, update the existing log
  if (id) {
    const updatedLog = await prisma.material.update({
      where: { id },
      data: {
        name,
        LocationOfMaterial,
        quantity,
        materialWeight,
        // TODO: These fields don't exist in current database schema - temporarily commented out
        // lightWeight,
        // grossWeight,
        loadType,
      },
    });

    console.log("Updated Hauling Log:", updatedLog);
    return updatedLog;
  }

  // If no ID, create a new log
  const haulingLog = await prisma.material.create({
    data: {
      name,
      LocationOfMaterial,
      quantity,
      truckingLogId,
    },
  });
  revalidateTag("material");
  console.log("New Hauling Log:", haulingLog);
  return haulingLog;
}

export async function deleteHaulingLogs(id: string) {
  console.log("Deleting hauling logs...");
  console.log(id);
  await prisma.material.delete({
    where: { id },
  });

  revalidateTag("material");
  return true;
}

export async function deleteLaborTypeLogs(id: string) {
  console.log("Deleting hauling logs...");
  console.log(id);
  await prisma.truckLaborLogs.delete({
    where: { id },
  });

  revalidateTag("material");
  return true;
}
/* Update */
//------------------------------------------------------------------
//------------------------------------------------------------------

export const updateTruckingMileage = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const endingMileage = parseInt(formData.get("endingMileage") as string);

  const updatedLog = await prisma.truckingLog.update({
    where: { id },
    data: {
      endingMileage,
    },
  });
  return updatedLog;
};

export const updateTruckDrivingNotes = async (formData: FormData) => {
  const TruckingId = formData.get("id") as string;
  const comment = (formData.get("comment") as string) || "";

  const updatedLog = await prisma.truckingLog.update({
    where: { id: TruckingId },
    data: {
      TimeSheet: {
        update: {
          comment,
        },
      },
    },
  });

  revalidatePath("/dashboard/truckingAssistant");
  return updatedLog;
};

export async function createStateMileage(formData: FormData) {
  console.log("Creating hauling logs...");
  console.log(formData);
  const truckingLogId = formData.get("truckingLogId") as string;

  const equipmentHauled = await prisma.stateMileage.create({
    data: {
      truckingLogId,
    },
  });

  console.log(equipmentHauled);
  revalidatePath("/dashboard/truckingAssistant");
  revalidateTag("equipmentHauled");
  return equipmentHauled;
}

export async function updateStateMileage(formData: FormData) {
  const id = formData.get("id") as string;
  const state = formData.get("state") as string;
  const stateLineMileage = Number(formData.get("stateLineMileage")) || 0;

  // Update the state mileage in the database
  const updatedStateMileage = await prisma.stateMileage.update({
    where: { id },
    data: {
      state,
      stateLineMileage,
    },
  });

  console.log("Updated State Mileage:", updatedStateMileage);

  return updatedStateMileage;
}

export async function deleteStateMileage(id: string) {
  console.log("Deleting State Mileage:", id);
  await prisma.stateMileage.delete({
    where: { id },
  });

  return true;
}

export async function createRefuelLog(formData: FormData) {
  console.log("Creating refuel logs...");
  console.log(formData);
  const truckingLogId = formData.get("truckingLogId") as string;

  const refueledLogs = await prisma.refuelLog.create({
    data: {
      truckingLogId,
    },
  });

  console.log(refueledLogs);
  revalidatePath("/dashboard/truckingAssistant");
  return refueledLogs;
}

export async function createRefuelEquipmentLog(formData: FormData) {
  console.log("Creating refuel logs...");
  console.log(formData);

  const employeeEquipmentLogId = formData.get(
    "employeeEquipmentLogId"
  ) as string;

  const gallonsRefueledStr = formData.get("gallonsRefueled") as string | null;
  const gallonsRefueled = gallonsRefueledStr
    ? parseFloat(gallonsRefueledStr)
    : null;

  const refueledLogs = await prisma.refuelLog.create({
    data: {
      employeeEquipmentLogId,
      gallonsRefueled,
    },
  });

  console.log(refueledLogs);
  revalidatePath(`/dashboard/equipment/${employeeEquipmentLogId}`);
  revalidatePath("/dashboard/truckingAssistant");

  const { id } = refueledLogs;
  const data = { id, gallonsRefueled, employeeEquipmentLogId };
  return data;
}

export async function deleteEmployeeEquipmentLog(id: string) {
  try {
    console.log("Deleting employee equipment log:", id);
    await prisma.employeeEquipmentLog.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting employee equipment log:", error);
    throw error;
  }
}

export async function updateRefuelLog(formData: FormData) {
  const id = formData.get("id") as string;
  const gallonsRefueled =
    Number(formData.get("gallonsRefueled") as string) || 0;
  const milesAtFueling = Number(formData.get("milesAtfueling")) || 0;

  // Update the state mileage in the database
  const updatedStateMileage = await prisma.refuelLog.update({
    where: { id },
    data: {
      gallonsRefueled,
      milesAtFueling,
    },
  });
  revalidatePath("/dashboard/truckingAssistant");
  console.log("Updated State Mileage:", updatedStateMileage);

  return updatedStateMileage;
}

export async function deleteRefuelLog(id: string) {
  console.log("Deleting refuel logs:", id);
  console.log("id", id);
  await prisma.refuelLog.delete({
    where: { id },
  });

  return true;
}
