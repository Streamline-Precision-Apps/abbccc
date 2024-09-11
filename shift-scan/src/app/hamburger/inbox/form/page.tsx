"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import Content from "@/app/hamburger/inbox/form/content";

export default async function Form() {
    const session = await auth();
    if (!session) return null
    const user_Id = session?.user.id;
    const signature = await prisma.user.findUnique({
        where: {
            id: user_Id
        },
        select: {
            Signature: true
        }
    });
    
    return (
    <Content signature={signature} session={session} />
    )
}