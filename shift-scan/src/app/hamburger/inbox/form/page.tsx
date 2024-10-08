"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import Content from "@/app/hamburger/inbox/form/content";
import { cookies } from "next/headers";

export default async function Form() {
  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en"; // Default to English

  const session = await auth().catch((err) => {
    console.error("Error in authentication:", err);
    return null;
  });
  const userId = session?.user.id;

  const user = await prisma.users
    .findUnique({
      where: {
        id: userId,
      },
      select: {
        signature: true,
      },
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      return null;
    });

  return user ? <Content signature={user.signature} session={session} /> : null;
}
