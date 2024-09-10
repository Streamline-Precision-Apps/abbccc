"use server";
import Content from "@/app/hamburger/inbox/content";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default async function Inbox() {
    const session = await auth();
    const user_Id = session?.user.id;
    const permission = session?.user.permission

    // gives you all the inbox of the user with no filter so well come back here later.
    const sentContent = await prisma.timeoffRequestForm.findMany({
        where: {
            employee_id: user_Id,   
        }
    })
    const myTeamnumber = await prisma.crewMember.findMany({
        where: {
            employee_id: user_Id,
        }
    })
    const crewMembers = prisma.crewMember.findMany({
        where: {
            crew_id: myTeamnumber[0].crew_id,
            supervisor: false
        }
        
    })

    const recievedContent = await prisma.timeoffRequestForm.findMany({
        where: {
            
        } 
    })

    if (permission === "admin" || permission === "manager") {
    return (
        <Content sentContent={sentContent} recievedContent={recievedContent} />
    )
    }
    else {
        return (
            <Content sentContent={sentContent} />
        )
    }
}
