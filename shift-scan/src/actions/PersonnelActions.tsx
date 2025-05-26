"use server";
import prisma from "@/lib/prisma";
import {
  FormStatus,
  TimeOffRequestType,
  Permission,
  WorkType,
} from "@/lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  CrewData,
  CrewEditState,
} from "@/app/(routes)/admins/personnel/components/types/personnel";

//------------------------------------------------------------------------------------------------------------------------
// Personnel server actions
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
export async function editPersonnelInfo(formData: FormData) {
  try {
    console.log("Editing personnel info...");
    console.log(formData);
    // Extract all form data
    const id = formData.get("id") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const DOB = formData.get("DOB") as string;
    const permission = formData.get("permission") as string;
    const truckView = formData.get("truckView") === "true";
    const tascoView = formData.get("tascoView") === "true";
    const laborView = formData.get("laborView") === "true";
    const mechanicView = formData.get("mechanicView") === "true";
    const activeEmployee = formData.get("activeEmployee") === "true";
    const phoneNumber = formData.get("phoneNumber") as string;
    const emergencyContact = formData.get("emergencyContact") as string;
    const emergencyContactNumber = formData.get(
      "emergencyContactNumber"
    ) as string;
    const crewLeads = JSON.parse(formData.get("crewLeads") as string) as Record<
      string,
      boolean
    >;
    const terminationDate = formData.get("terminationDate") as string;
    const selectedCrews = JSON.parse(
      formData.get("selectedCrews") as string
    ) as string[];

    // Execute all updates in a transaction
    await prisma.$transaction(async (prisma) => {
      // 1. Update basic user info
      await prisma.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          email,
          DOB,
          permission: permission as Permission,
          truckView,
          tascoView,
          laborView,
          mechanicView,
          activeEmployee,
          terminationDate,
        },
      });

      // 2. Update contact info
      await prisma.contacts.update({
        where: { userId: id },
        data: {
          phoneNumber,
          emergencyContact,
          emergencyContactNumber,
        },
      });

      // 3. Handle crew memberships
      // First disconnect from all current crews
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          Crews: {
            set: [], // This removes all crew connections for this user
          },
        },
      });

      // Then connect to selected crews
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          Crews: {
            connect: selectedCrews.map((crewId) => ({ id: crewId })),
          },
        },
      });

      // Then set as lead for specified crews
      for (const [crewId, shouldBeLead] of Object.entries(crewLeads)) {
        if (shouldBeLead) {
          await prisma.crew.update({
            where: { id: crewId },
            data: { leadId: id },
          });
        }
      }
    });

    revalidateTag("employees");
    revalidateTag("crews");
    revalidatePath("/admins/personnel");

    return true;
  } catch (error) {
    console.error("Error updating personnel info:", error);
    return new Response("Error updating personnel information", {
      status: 500,
    });
  }
}

//------------------------------------------------------------------------------------------------------------------------

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
    revalidateTag("crews");
    return true;
  } catch (error) {
    console.error("Error changing crew lead:", error);
    throw new Error("Failed to change crew lead");
  }
}

// Create jobsite admin
export async function createJobsite(formData: FormData) {
  try {
    console.log("Creating jobsite...");
    console.log(formData);

    await prisma.jobsite.create({
      data: {
        name: formData.get("name") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zipCode: formData.get("zip") as string,
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

//------------------------------------------------------------------------------------------------------------------------

// Save (create or update) a crew
export async function saveCrew(crew: CrewData) {
  console.log("Saving crew...");
  console.log(crew);
  return;
}

// Delete a crew by id
export async function deleteCrew(crewId: string) {
  try {
    await prisma.crew.delete({ where: { id: crewId } });
    revalidateTag("crews");
    revalidatePath("/admins/personnel");
    return true;
  } catch (error) {
    console.error("Error deleting crew:", error);
    throw new Error("Failed to delete crew");
  }
}

export async function RemoveUserProfilePicture(userId: string) {
  try {
    console.log("Removing user profile picture...");
    console.log("User ID:", userId);
    await prisma.user.update({
      where: { id: userId }, // Replace with actual user ID
      data: { image: null },
    });
    revalidateTag("profilePicture");
    return true;
  } catch (error) {
    console.error("Error removing user profile picture:", error);
    throw new Error("Failed to remove profile picture");
  }
}
