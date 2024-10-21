"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function timecardData(formData: FormData) {
  const startDate = formData.get("start") as string;
  const endDate = formData.get("end") as string;

  const startOfDay = new Date(startDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(endDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const timeSheets = await prisma.timeSheets.findMany({
    where: {
      date: {
        gte: startOfDay.toISOString(),
        lte: endOfDay.toISOString(),
      },
    },
  });

  console.log("\n\n\nTimeSheets:", timeSheets);
  return timeSheets;
}

// Create jobsite admin
export async function createJobsite(formData: FormData) {
  try {
    console.log("Creating jobsite...");
    console.log(formData);

    await prisma.jobsites.create({
      data: {
        name: formData.get("name") as string,
        streetNumber: (formData.get("streetNumber") as string) || null,
        streetName: formData.get("streetName") as string,
        city: formData.get("city") as string,
        state: (formData.get("state") as string) || null,
        country: formData.get("country") as string,
        description: formData.get("description") as string,
        comment: (formData.get("jobsite_comment") as string) || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log("Jobsite created successfully.");

    // Revalidate the path
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
  }
}

export async function updateJobsite(formData: FormData) {
  try {
    console.log("Updating jobsite...");
    console.log(formData);
    const name = formData.get("name") as string;
    const streetNumber = formData.get("streetNumber") as string;
    const streetName = formData.get("streetName") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const country = formData.get("country") as string;
    const description = formData.get("description") as string;
    const comment = formData.get("jobsite_comment") as string;
    const isActive = Boolean(formData.get("isActive") as string);

    const id = formData.get("id") as string;
    await prisma.jobsites.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        streetNumber: streetNumber,
        streetName: streetName,
        city: city,
        state: state,
        country: country,
        description: description,
        comment: comment,
        isActive: isActive,
      },
    });
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error updating jobsite:", error);
    throw error;
  }
}

// Fetch first jobsite
export async function fetchByNameJobsite(name: string) {
  const jobsite = await prisma.jobsites.findFirst({
    where: {
      name: name,
    },
  });
  revalidatePath(`/admin/assets`);
  return jobsite;
}

// Delete jobsite by id
export async function deleteJobsite(formData: FormData) {
  const qrId = formData.get("qrId") as string;
  try {
    await prisma.jobsites.delete({
      where: { qrId: qrId },
    });
    revalidatePath(`/admin/assets`);
    return true;
  } catch (error) {
    console.error("Error deleting jobsite:", error);
    throw error;
  }
}

export async function editGeneratedJobsite(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const qrId = formData.get("qrId") as string;

    await prisma.jobsites.update({
      where: {
        qrId: qrId,
      },
      data: {
        name: name,
        qrId: qrId,
      },
    });

    revalidatePath(`/admin/assets`);

    return;
  } catch (error) {
    console.error("Error editing generated jobsite:", error);
    throw error;
  }
}

export async function createCostCode(formData: FormData) {
  try {
    console.log("Creating cost code...");
    console.log(formData);
    // Check if cost code already exists
    await prisma.costCodes.create({
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        type: formData.get("type") as string,
      },
    });
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating cost code:", error);
    throw error;
  }
}
export async function fetchByNameCostCode(description: string) {
  const costCode = await prisma.costCodes.findFirst({
    where: {
      description: description,
    },
  });
  revalidatePath(`/admin/assets`);
  return costCode;
}

export async function findAllCostCodesByTags(formData: FormData) {
  console.log("findAllCostCodesByTags");
  console.log(formData);

  const type = formData.get("type") as string;
  const costCodes = await prisma.costCodes.findMany({
    where: {
      type: type,
    },
  });
  revalidatePath(`/admin/assets`);
  return costCodes;
}

export async function EditCostCode(formData: FormData) {
  try {
    console.log("Creating cost code...");
    console.log(formData);
    const id = Number(formData.get("id") as string);
    const name = formData.get("name") as string;
    const costCodeDescription = formData.get("description") as string;
    const costCodeType = formData.get("type") as string;
    await prisma.costCodes.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        description: costCodeDescription,
        type: costCodeType,
      },
    });

    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating cost code:", error);
    throw error;
  }
}
export async function deleteCostCode(formData: FormData) {
  const id = Number(formData.get("id") as string);
  try {
    await prisma.costCodes.delete({
      where: { id: id },
    });
    revalidatePath(`/admin/assets`);
    return true;
  } catch (error) {
    console.error("Error deleting jobsite:", error);
    throw error;
  }
}

export async function TagCostCodeChange(formData: FormData) {
  try {
    console.log("Creating cost code...");
    console.log(formData);
    const id = Number(formData.get("id") as string);
    const costCodeType = formData.get("type") as string;
    await prisma.costCodes.update({
      where: {
        id: id,
      },
      data: {
        type: costCodeType,
      },
    });

    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating cost code:", error);
    throw error;
  }
}

export async function AddlistToJobsite(formData: FormData) {
  try {
    console.log("Adding cost codes to job site...");
    const qrId = formData.get("qrId") as string;
    const costCodeTypes = (formData.get("types") as string)
      .split(",")
      .map((code) => code.trim());

    // Find all cost codes that match the list of types
    const costCodes = await prisma.costCodes.findMany({
      where: {
        type: {
          in: costCodeTypes,
        },
      },
    });

    if (costCodes.length === 0) {
      console.log("No matching cost codes found.");
      return;
    }

    console.log("Cost codes found:", costCodes);

    // Connect the found cost codes to the job site
    const jobsite = await prisma.jobsites.update({
      where: {
        qrId: qrId,
      },
      data: {
        costCode: {
          connect: costCodes.map((code) => ({ id: code.id })),
        },
      },
    });

    console.log("Job site updated with cost codes:", jobsite);

    // Revalidate the path to reflect changes
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error adding cost codes to job site:", error);
    throw error;
  }
}

export async function RemovelistToJobsite(formData: FormData) {
  try {
    console.log("Adding cost codes to job site...");
    const qrId = formData.get("qrId") as string;
    const costCodeTypes = (formData.get("types") as string)
      .split(",")
      .map((code) => code.trim());

    // Find all cost codes that match the list of types
    const costCodes = await prisma.costCodes.findMany({
      where: {
        type: {
          in: costCodeTypes,
        },
      },
    });

    if (costCodes.length === 0) {
      console.log("No matching cost codes found.");
      return;
    }

    console.log("Cost codes found:", costCodes);

    // Connect the found cost codes to the job site
    const jobsite = await prisma.jobsites.update({
      where: {
        qrId: qrId,
      },
      data: {
        costCode: {
          disconnect: costCodes.map((code) => ({ id: code.id })),
        },
      },
    });

    console.log("Job site updated with cost codes:", jobsite);

    // Revalidate the path to reflect changes
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error adding cost codes to job site:", error);
    throw error;
  }
}
