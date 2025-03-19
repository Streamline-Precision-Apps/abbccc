"use server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

/* LOADS Hauled */
//------------------------------------------------------------------
//------------------------------------------------------------------

export async function createLoad(formData: FormData) {
  console.log("Creating Load...");
  console.log(formData);
  const tascoLogId = formData.get("tascoLogId") as string;

  const load = await prisma.loads.create({
    data: {
      tascoLogId,
    },
  });

  console.log("New Load:", load);
  revalidatePath("/dashboard/tasco");
  revalidateTag("load");
  return load;
}

export async function updateLoads(formData: FormData) {
  const id = formData.get("id") as string;
  const loadType = formData.get("loadType") as string;
  const loadWeight = parseInt(formData.get("loadWeight") as string);
  const tascoLogId = formData.get("tascoLogId") as string;

  // If ID is provided, update the existing log
  if (id) {
    const updatedLog = await prisma.loads.update({
      where: { id },
      data: {
        loadType,
        loadWeight,
      },
    });

    console.log("Updated Hauling Log:", updatedLog);
    return updatedLog;
  }

  // If no ID, create a new log
  const load = await prisma.loads.create({
    data: {
      loadType,
      loadWeight,
      tascoLogId,
    },
  });

  console.log("Created Hauling Log:", load);
  revalidateTag("load");
  return load;
}

export async function deleteLoad(id: string) {
  console.log("Deleting load...");
  console.log(id);
  await prisma.loads.delete({
    where: { id },
  });

  revalidateTag("load");
  return true;
}

export async function deleteOneLoad(tascoId: string) {
  console.log("Deleting first load associated with Tasco Log...");
  console.log(tascoId);

  try {
    // Find the first Load attached to the TascoLog
    const firstLoad = await prisma.loads.findFirst({
      where: {
        tascoLogId: tascoId, // Find loads linked to this Tasco Log
      },
    });

    if (!firstLoad) {
      console.log("No loads found for this Tasco Log.");
      return false;
    }

    // Delete the first found Load
    await prisma.loads.delete({
      where: {
        id: firstLoad.id,
      },
    });

    console.log(`Deleted Load ID: ${firstLoad.id}`);

    // Revalidate the tag to update UI
    revalidateTag("load");

    return true;
  } catch (error) {
    console.error("Error deleting load:", error);
    return {
      success: false,
      message: "An error occurred while deleting the load.",
    };
  }
}

export async function deleteLoadById(loadId: string) {
  console.log("Deleting load associated with Load Id " + loadId);

  try {
    // Find the first Load attached to the TascoLog
    const targetLoad = await prisma.loads.findFirst({
      where: {
        tascoLogId: loadId, // Find loads linked to this Tasco Log
      },
    });

    if (!targetLoad) {
      console.log("No loads found for this Load ID.");
      return false;
    }

    // Delete the first found Load
    await prisma.loads.delete({
      where: {
        id: targetLoad.id,
      },
    });

    console.log(`Deleted Load ID: ${targetLoad.id}`);

    // Revalidate the tag to update UI
    revalidateTag("load");

    return true;
  } catch (error) {
    console.error("Error deleting load:", error);
    return {
      success: false,
      message: "An error occurred while deleting the load.",
    };
  }
}

// /* Tasco Comments */
// ------------------------------------------------------------------
// ------------------------------------------------------------------

export const updateTascoComments = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const comment = formData.get("comment") as string;

  const updatedLog = await prisma.tascoLog.update({
    where: { id },
    data: {
      comment,
    },
  });

  revalidatePath("/dashboard/tascoAssistant");
  return updatedLog;
};

// /* Tasco Refuel Logs */
// ------------------------------------------------------------------
// ------------------------------------------------------------------
export async function createRefuelLog(formData: FormData) {
  console.log("Creating refuel logs...");
  console.log(formData);
  const tascoLogId = formData.get("tascoLogId") as string;

  const refueledLogs = await prisma.refueled.create({
    data: {
      tascoLogId,
    },
  });

  console.log(refueledLogs);
  revalidatePath("/dashboard/tasco");
  return refueledLogs;
}

export async function createRefuelEquipmentLog(formData: FormData) {
  console.log("Creating refuel logs...");
  console.log(formData);
  const employeeEquipmentLogId = formData.get(
    "employeeEquipmentLogId"
  ) as string;

  const refueledLogs = await prisma.refueled.create({
    data: {
      employeeEquipmentLogId,
    },
  });

  console.log(refueledLogs);
  revalidatePath("/dashboard/tasco");
  return refueledLogs;
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
  const milesAtfueling = Number(formData.get("milesAtfueling")) || 0;

  // Update the state mileage in the database
  const updatedStateMileage = await prisma.refueled.update({
    where: { id },
    data: {
      gallonsRefueled,
      milesAtfueling,
    },
  });
  revalidatePath("/dashboard/tasco");
  console.log("Updated State Mileage:", updatedStateMileage);

  return updatedStateMileage;
}

export async function deleteRefuelLog(id: string) {
  console.log("Deleting refuel logs:", id);
  console.log("id", id);
  await prisma.refueled.delete({
    where: { id },
  });

  return true;
}


