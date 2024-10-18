"use server";
import prisma from "@/lib/prisma";
import * as z from "zod";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

const parseUTC = (timestamp: string): Date => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    throw new RangeError(`Invalid time value: ${timestamp}`);
  }
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  console.log("Parse UTC date:", date);
  return date;
};

export const Reset = async (formData: FormData) => {
  const email = formData.get("email") as string;

  if (!email) {
    return null;
  }
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return { error: "Email not found" };
  }

  // check to make sure user gets a token if passed
  const passwordResetToken = await generatePasswordResetToken(email);
  // passes email and token to send an email out
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Email sent" };
};

export async function resetUserPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const newPassword = formData.get("password") as string;
  // Fetch the password reset token
  const verify = await prisma.passwordResetTokens.findUnique({
    where: { token },
  });

  if (!verify) {
    throw new Error("Invalid token");
  }

  // Ensure the token has not expired
  if (verify.expiration < new Date()) {
    throw new Error("Token expired");
  }
  const expires = new Date(
    parseUTC(verify.expiration.toString())
  ).toISOString();

  // Fetch the user by email
  const user = await prisma.users.findUnique({
    where: { email: verify.email },
  });

  if (!user) {
    throw new Error("Invalid token");
  }

  // delete the token
  await prisma.passwordResetTokens.delete({
    where: { id: verify.id },
  });

  // Update the user's password in the database
  await prisma.users.update({
    where: { id: user.id },
    data: {
      password: newPassword,
    },
  });
}
