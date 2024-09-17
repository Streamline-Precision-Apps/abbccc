// lets employee view there hours for each day recored day. 
"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ViewTimeSheets from "@/app/(routes)/timesheets/view-timesheets";
import { TimeSheet } from "@/lib/types";

export default async function Timesheets() {
    const session = await auth();
    const id = session?.user.id;
    
    const timesheets = await prisma.timeSheets.findMany({ 
        where: { userId: id },
    }) as TimeSheet[];
    
    return (
        <ViewTimeSheets timesheets={timesheets} user={id} />
    )
}