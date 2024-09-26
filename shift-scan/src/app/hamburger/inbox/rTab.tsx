"use client"
import User from "@/app/(routes)/dashboard/user";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { inboxContent } from "@/lib/types";
import { redirect } from "next/navigation";


export default function RTab({sentContent, session, receivedContent: recievedContent} : inboxContent) {
    if (!session) {
        return redirect("/signin")
    }
    // check to see if a user is an admin/Manager/SuperAdmin
    const p = session.user.permission 
    if (!["SUPERADMIN", "MANAGER", "ADMIN"].includes(p)) {
        return <Titles>Coming Soon</Titles>;
    }
    const user_Id = session?.user?.id
    const pending = recievedContent?.filter((item)=> item.employeeId !== user_Id)
    
    if (pending=== undefined || pending.length <= 0) {
        return <Titles>There Are No Requests Currently</Titles>
    }
    console.log(recievedContent)

    return (
        <>
        {pending.map((item) => (
        <Buttons background={"orange"} key={item.id} href={`/hamburger/inbox/recieved/${item.id}`}>
        <Titles>
            {item.requestType} 
        </Titles>
            {item.date.toLocaleString("en-US", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: undefined,
                minute: undefined,
                second: undefined,
            })}
        </Buttons>
    ))}
    </>
    )
}