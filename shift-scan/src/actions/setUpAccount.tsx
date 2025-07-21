"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3),
  code: z.string().length(6),
  password: z.string().min(8),
});

export async function completeRegistration(_: any, formData: FormData) {
  const input = schema.safeParse({
    username: formData.get("username"),
    code: formData.get("code"),
    password: formData.get("password"),
  });

  if (!input.success) {
    return { success: false, error: "Invalid input" };
  }

  const { username, code, password } = input.data;

  const user = await prisma.user.findUnique({
    where: { username },
    include: { accountSetupToken: true },
  });

  if (!user || !user.accountSetupToken) {
    return { success: false, error: "User or code not found" };
  }

  const token = user.accountSetupToken;
  if (token.code !== code || token.used || token.expiresAt < new Date()) {
    return { success: false, error: "Invalid or expired code" };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, accountSetup: true },
    }),
    prisma.accountSetupToken.update({
      where: { id: token.id },
      data: { used: true },
    }),
  ]);

  return { success: true };
}

export async function createSetupToken(userId: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.accountSetupToken.create({
    data: { code, userId, expiresAt },
  });

  return code;
}
