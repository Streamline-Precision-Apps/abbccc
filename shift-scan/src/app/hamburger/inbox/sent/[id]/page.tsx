"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Content from "@/app/hamburger/inbox/sent/[id]/content";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();
    const userId = session?.user.id;

    const sentContent = await prisma.timeoffRequestForms.findMany({
        where: {
            id : Number(params.id),
            employeeId: userId,
        }
    })
    
    return (
        <>
            <Content sentContent={sentContent} session={session} params={params}/>
        </>
    )
}