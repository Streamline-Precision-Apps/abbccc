"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Content from "@/app/hamburger/inbox/recieved/[id]/content";
import { redirect } from "next/navigation"
import Manager from "@/app/(routes)/dashboard/manager";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();
    const manager = `${session?.user?.firstName} ${session?.user?.lastName}`; 

    const receivedContent = await prisma.timeoffRequestForms.findMany({
        where: {
            id : Number(params.id),
            status : "PENDING"
        }
    })
    if ( receivedContent.length <= 0){
        return redirect("/hamburger/inbox")
    }
    const employeeId =  receivedContent[0]?.employeeId

    const employeeName = await prisma.users.findUnique({
        where: {
            id: employeeId
        },
        select:{
            firstName:true,
            lastName:true,
        }
    })
    const name = (employeeName?.firstName ?? '') + " " + (employeeName?.lastName ?? '')
    return (
        <>
            <Content  receivedContent={receivedContent} session={session} params={params} name={name} manager={manager} />
        </>
    )
}