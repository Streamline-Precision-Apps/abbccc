// lets employee view there hours for each day recored day. 
"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ViewTimeSheets from "@/app/(routes)/timesheets/view-timesheets";

export default async function Timesheets() {
    const session = await auth();
    const id = session?.user.id;
    
    const timesheets = await prisma.timeSheet.findMany({ 
    where: { userId: id },
});
    
    return (
        <ViewTimeSheets timesheets={timesheets} user={id} />
    )
}