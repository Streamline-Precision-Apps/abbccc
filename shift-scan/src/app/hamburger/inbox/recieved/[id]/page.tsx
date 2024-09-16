"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Content from "@/app/hamburger/inbox/recieved/[id]/content";
import { redirect } from "next/navigation"
import Manager from "@/app/(routes)/dashboard/manager";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await auth();
    const manager = `${session?.user?.firstName} ${session?.user?.lastName}`; 

    const recievedContent = await prisma.timeoffRequestForm.findMany({
        where: {
            id : Number(params.id),
            status : "PENDING"
        }
    })
    if (recievedContent.length <= 0){
        return redirect("/hamburger/inbox")
    }
    const employee_id = recievedContent[0]?.employee_id

    const employeeName = await prisma.user.findUnique({
        where: {
            id: employee_id
        },
        select:{
            firstName:true,
            lastName:true,
        }
    })
    const name = (employeeName?.firstName ?? '') + " " + (employeeName?.lastName ?? '')
    return (
        <>
            <Content recievedContent={recievedContent} session={session} params={params} name={name} manager={manager} />
        </>
    )
}