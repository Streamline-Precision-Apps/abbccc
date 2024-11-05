"use server";
import prisma from "@/lib/prisma";
import { Permission } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
  try {
    console.log("Creating user:", formData);
    await prisma.users.create({
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

export async function updateUser(formData: FormData) {
  await prisma.users.update({
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

export async function deleteUser(formData: FormData) {
  const date = new Date();
  const id = formData.get("id") as string;
  await prisma.users.update({
    where: { id },
    data: {
      terminationDate: date.toISOString(),
    },
  });
}

export async function uploadImage(formdata: FormData) {
  console.log(formdata);
  await prisma.users.update({
    where: { id: formdata.get("id") as string },
    data: {
      image: formdata.get("image") as string,
    },
  });
  revalidatePath("/hamburger/profile");
}

export async function uploadFirstImage(formdata: FormData) {
  console.log(formdata);
  await prisma.users.update({
    where: { id: formdata.get("id") as string },
    data: {
      image: formdata.get("image") as string,
    },
  });
}

export async function uploadFirstSignature(formdata: FormData) {
  console.log(formdata);
  await prisma.users.update({
    where: { id: formdata.get("id") as string },
    data: {
      signature: formdata.get("signature") as string,
    },
  });
}

export async function setUserSettings(formdata: FormData) {
  console.log(formdata);
  await prisma.userSettings.update({
    where: { userId: formdata.get("id") as string },
    data: {
      approvedRequests: formdata.get("approvedRequests") === "true",
      timeOffRequests: formdata.get("timeoffRequests") === "true",
      generalReminders: formdata.get("GeneralReminders") === "true",
    },
  });
}

export async function setUserLanguage(formdata: FormData) {
  console.log(formdata);
  await prisma.userSettings.update({
    where: { userId: formdata.get("id") as string },
    data: {
      language: formdata.get("language") as string,
    },
  });
}

export async function fetchByNameUser(name: string) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { firstName: { contains: name, mode: "insensitive" } },
          { lastName: { contains: name, mode: "insensitive" } },
        ],
      },
    });
    console.log(user);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function getUserFromDb(username: string, password: string) {
  const user = await prisma.users.findUnique({
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
  await prisma.users.update({
    where: { id: id },
    data: {
      accountSetup: true,
    },
  });
}

export async function setUserPassword(formData: FormData) {
  await prisma.users.update({
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
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      emergencyContact: formData.get("emergencyContact") as string,
      emergencyContactNumber: formData.get("emergencyContactNumber") as string,
    },
  });

  revalidatePath("/admins");
  return true;
}
