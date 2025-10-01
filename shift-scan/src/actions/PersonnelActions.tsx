"use server";
import prisma from "@/lib/prisma";
import { Permission } from "../../prisma/generated/prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

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
    // Extract all form data
    const id = formData.get("id") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const permission = formData.get("permission") as string;
    const truckView = formData.get("truckView") === "true";
    const tascoView = formData.get("tascoView") === "true";
    const laborView = formData.get("laborView") === "true";
    const mechanicView = formData.get("mechanicView") === "true";

    const crewLeads = JSON.parse(formData.get("crewLeads") as string) as Record<
      string,
      boolean
    >;
    const terminationDate = formData.get("terminationDate") as string | null;
    const selectedCrews = JSON.parse(
      formData.get("selectedCrews") as string,
    ) as string[];

    // Execute all updates in a transaction
    await prisma.$transaction(async (prisma) => {
      // 1. Update basic user info
      await prisma.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          permission: permission as Permission,
          truckView,
          tascoView,
          laborView,
          mechanicView,
          terminationDate:
            terminationDate && terminationDate !== ""
              ? new Date(terminationDate)
              : null, // Handle empty string case
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
    await prisma.jobsite.create({
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        comment: (formData.get("jobsite_comment") as string) || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Revalidate the path
    revalidatePath(`/admin/assets`);
  } catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
  }
}

//------------------------------------------------------------------------------------------------------------------------

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

// When archiving/reactivating personnel, use terminationDate
export async function reactivatePersonnel(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    // Update the user record, setting terminationDate to null
    await prisma.user.update({
      where: { id },
      data: {
        terminationDate: null,
      },
    });

    revalidateTag("employees");
    revalidatePath("/admins/personnel");
    return true;
  } catch (error) {
    console.error("Error reactivating personnel:", error);
    throw new Error("Failed to reactivate personnel");
  }
}

export async function archivePersonnel(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    // Update the user record, setting terminationDate to the current date
    await prisma.user.update({
      where: { id },
      data: {
        terminationDate: new Date().toISOString(),
      },
    });

    revalidateTag("employees");
    revalidatePath("/admins/personnel");
    return true;
  } catch (error) {
    console.error("Error archiving personnel:", error);
    throw new Error("Failed to archive personnel");
  }
}
