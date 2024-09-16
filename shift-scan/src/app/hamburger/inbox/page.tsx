"use server";
import Content from "@/app/hamburger/inbox/content";
import { auth } from "@/auth";
import UserId from "@/components/userId";
import prisma from "@/lib/prisma";

export default async function Inbox() {
    const session = await auth();
    if (!session) return null
    const user_Id = session?.user.id;
    const permission = session?.user.permission

    // gives you all the inbox of the user with no filter so well come back here later.
    const sentContent = await prisma.timeoffRequestForms.findMany({
        where: {
            employeeId: user_Id,   
        }
    })

    const myTeamnumber = await prisma.crewMembers.findMany({
        where: {
            employeeId: user_Id,
        }
    })
    const crewMembers = prisma.crewMembers.findMany({
        where: {
            crewId: myTeamnumber[0].crewId,
            supervisor: false
        }
        
    })

    // get all the time request forms
    const recievedContent = await prisma.timeoffRequestForms.findMany({
        where :{
            status : "PENDING"
        }
    })

    const pending = sentContent.filter((item) => item.status === "PENDING" );
        return (
            <Content sentContent={sentContent} receivedContent={recievedContent} session={session} />
        )
    }
