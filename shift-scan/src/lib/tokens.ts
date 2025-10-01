"use server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { reportError } from "./sentryErrorHandler";
import { PasswordResetTokenByEmail } from "@/data/password-reset-token";

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = uuidv4();
    // expiration 24 hour from timezone 1
    const expiration = new Date(new Date().getTime() + 3600 * 1000);
    // update expiration date to your timezone
    const expires = new Date(expiration).toISOString();

    const existingToken = await PasswordResetTokenByEmail(email);

    if (existingToken) {
      await prisma.passwordResetToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiration: expires,
      },
    });
    return passwordResetToken;
  } catch (error) {
    reportError(error, {
      location: "tokens/generatePasswordResetToken",
      email,
    });
    throw error;
  }
};
