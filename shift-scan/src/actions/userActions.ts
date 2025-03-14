"use server";
import prisma from "@/lib/prisma";
import { Permission } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
  try {
    // prevent duplicate user as long as first name, last name, and DOB are the same
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const DOB = formData.get("DOB") as string;
    const user = await prisma.user.findMany({
      where: {
        firstName,
        lastName,
        DOB,
      },
      select: {
        id: true,
      },
    });
    const existingUser = user[0]?.id;

    if (user.length > 0) {
      console.log("User already exists");
      console.log(existingUser);
      return;
    }

    console.log("Creating user:", formData);
    await prisma.user.create({
      data: {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        DOB: formData.get("DOB") as string,
        truckView: Boolean(formData.get("truckView")) as unknown as boolean,
        tascoView: Boolean(formData.get("tascoView")) as unknown as boolean,
        laborView: Boolean(formData.get("laborView")) as unknown as boolean,
        mechanicView: Boolean(
          formData.get("mechanicView")
        ) as unknown as boolean,
        permission: formData.get("permission") as Permission,
        image: formData.get("image") as string,
      },
    });
    console.log("User created successfully.");
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/");
}

// this creates a user from the admin view
export async function adminCreateUser(formData: FormData) {
  try {
    // Extract data from form
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const DOB = formData.get("DOB") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !email || !password || !DOB) {
      throw new Error("Required fields are missing.");
    }

    // Check for duplicate user based on firstName, lastName, and DOB
    const user = await prisma.user.findMany({
      where: {
        firstName,
        lastName,
        DOB,
      },
      select: {
        id: true,
      },
    });

    if (user.length > 0) {
      console.log(
        "User already exists based on first name, last name, and DOB"
      );
      return;
    }

    // Check for duplicate email
    const existingEmailUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmailUser) {
      console.log("User already exists with the provided email:", email);
      return;
    }

    console.log("Creating user:", formData);
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username: formData.get("username") as string,
        email,
        password: formData.get("password") as string,
        DOB,
        truckView: formData.get("truckView") === "true",
        tascoView: formData.get("tascoView") === "true",
        laborView: formData.get("laborView") === "true",
        mechanicView: formData.get("mechanicView") === "true",
        permission: formData.get("permission") as Permission,
        image: formData.get("image") as string,
      },
    });
    const employeeId = newUser.id;

    // Create contact details
    await prisma.contacts.create({
      data: {
        employeeId,
        phoneNumber: formData.get("phoneNumber") as string,
        emergencyContact: formData.get("emergencyContact") as string,
        emergencyContactNumber: formData.get(
          "emergencyContactNumber"
        ) as string,
      },
    });

    // Create user settings
    await prisma.userSettings.create({
      data: {
        userId: employeeId,
        language: "en",
        personalReminders: formData.get("personalReminders") === "true",
        generalReminders: formData.get("GeneralReminders") === "true",
        cameraAccess: formData.get("cameraAccess") === "false",
        locationAccess: formData.get("locationAccess") === "false",
      },
    });

    console.log("User created successfully.");
  } catch (error) {
    console.error("Error creating user:", error);
  }
  revalidatePath("/");
}

export async function updateUser(formData: FormData) {
  await prisma.user.update({
    where: { id: formData.get("id") as string },
    data: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      username: formData.get("username") as string,
      DOB: formData.get("DOB") as string,
      truckView: formData.get("truckView") === "true",
      tascoView: formData.get("tascoView") === "true",
      laborView: formData.get("laborView") === "true",
      mechanicView: formData.get("mechanicView") === "true",
      permission: formData.get("permission") as Permission,
      image: formData.get("image") as string,
    },
  });
}
export async function updateUserProfile(formData: FormData) {
  try {
    await prisma.user.update({
      where: { id: formData.get("id") as string },
      data: {
        email: formData.get("email") as string,
        contact: {
          update: {
            phoneNumber: formData.get("phoneNumber") as string,
            emergencyContact: formData.get("emergencyContact") as string,
            emergencyContactNumber: formData.get(
              "emergencyContactNumber"
            ) as string,
          },
        },
      },
    });
    revalidatePath("/hamburger/profile");
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

export async function deleteUser(formData: FormData) {
  const date = new Date();
  const id = formData.get("id") as string;
  await prisma.user.update({
    where: { id },
    data: {
      terminationDate: date.toISOString(),
    },
  });
}

export async function uploadImage(formdata: FormData) {
  console.log(formdata);
  await prisma.user.update({
    where: { id: formdata.get("id") as string },
    data: {
      image: formdata.get("image") as string,
    },
  });
  revalidatePath("/hamburger/profile");
}

export async function uploadFirstImage(formdata: FormData) {
  console.log(formdata);
  await prisma.user.update({
    where: { id: formdata.get("id") as string },
    data: {
      image: formdata.get("image") as string,
    },
  });
}

export async function uploadFirstSignature(formdata: FormData) {
  console.log(formdata);

  const result = await prisma.user.update({
    where: { id: formdata.get("id") as string },
    data: {
      signature: formdata.get("signature") as string,
    },
  });
  console.log(result);
}

export async function uploadSignature(id: string, signature: string) {
  console.log("id:", id, "signature:", signature);
  const result = await prisma.user.update({
    where: { id: id },
    data: {
      signature: signature,
    },
  });
  console.log(result);
}

export async function setUserSettings(formdata: FormData) {
  console.log(formdata);
  await prisma.userSettings.update({
    where: { userId: formdata.get("id") as string },
    data: {
      personalReminders: formdata.get("personalReminders") === "true",
      generalReminders: formdata.get("generalReminders") === "true",
    },
  });
}

export async function setUserPermissions(formdata: FormData) {
  console.log(formdata);
  await prisma.userSettings.update({
    where: { userId: formdata.get("id") as string },
    data: {
      cameraAccess: Boolean(formdata.get("cameraAccess") as string),
      locationAccess: Boolean(formdata.get("locationAccess") as string),
      personalReminders: Boolean(formdata.get("personalReminders") as string),
      generalReminders: Boolean(formdata.get("generalReminders") as string),
      cookiesAccess: Boolean(formdata.get("cookiesAccess") as string),
    },
  });
}

export async function setUserLanguage(formdata: FormData) {
  console.log(formdata);
  const result = await prisma.userSettings.update({
    where: { userId: formdata.get("id") as string },
    data: {
      language: formdata.get("language") as string,
    },
  });
  return result.language;
}

export async function getUserFromDb(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
      password: password,
    },
  });
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
  }
  return null;
}

export async function finishUserSetup(id: string) {
  await prisma.user.update({
    where: { id: id },
    data: {
      accountSetup: true,
    },
  });
}

export async function setUserPassword(formData: FormData) {
  await prisma.user.update({
    where: { id: formData.get("id") as string },
    data: {
      password: formData.get("password") as string,
    },
  });
}

export async function updateContactInfo(formData: FormData) {
  console.log(formData);
  await prisma.contacts.update({
    where: { employeeId: formData.get("id") as string },
    data: {
      phoneNumber: formData.get("phoneNumber") as string,
      emergencyContact: formData.get("emergencyContact") as string,
      emergencyContactNumber: formData.get("emergencyContactNumber") as string,
    },
  });

  revalidatePath("/admins");
  return true;
}
