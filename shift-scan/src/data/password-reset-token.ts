import prisma from "@/lib/prisma";

export async function PasswordResetToken(token: string) {
  try {
    const passwordResetToken = await prisma.passwordResetTokens.findUnique({
      where: {
        token: token,
      },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
}

export async function PasswordResetTokenByEmail(email: string) {
  try {
    const passwordResetToken = await prisma.passwordResetTokens.findFirst({
      where: {
        email,
      },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
}
