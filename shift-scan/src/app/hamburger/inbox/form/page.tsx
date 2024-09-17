"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import Content from "@/app/hamburger/inbox/form/content";

export default async function Form() {
    const session = await auth();
    if (!session) return null
    const userId = session?.user.id;
    const user = await prisma.users.findUnique({
        where: {
            id: userId
        },
        select: {
            signature: true
        }
    });
    
    return (
        user ? <Content signature={user.signature} session={session} /> : null
    )
}