"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Content from "@/app/hamburger/inbox/[id]/content";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();
    const user_Id = session?.user.id;

    const sentContent = await prisma.timeoffRequestForm.findMany({
        where: {
            id : Number(params.id),
            employee_id: user_Id,
        }
    })
    
    return (
        <>
            <Content sentContent={sentContent} session={session} params={params}/>
        </>
    )
}