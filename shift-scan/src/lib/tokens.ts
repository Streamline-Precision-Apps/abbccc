import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { PasswordResetTokenByEmail } from "@/components/(signup)/password-reset-token";
import { get } from "http";

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expiration = new Date(new Date().getTime() + 360 * 1000);

  const existingToken = await PasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetTokens.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await prisma.passwordResetTokens.create({
    data: {
      email,
      token,
      expiration,
    },
  });
  return passwordResetToken;
};
