"use server";
import Index from "@/app/hamburger/settings/content";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Bases } from "@/components/(reusable)/bases";
import { auth } from "@/auth";

export default async function Settings() {
const session = await auth();
const userId = session?.user.id;

const data = await prisma.userSettings.findUnique({
where: {
    userId: userId,
},
select: {
    userId: true,
    language: true,
    approvedRequests: true,
    timeOffRequests: true,
    generalReminders: true,
    biometric: true,
    cameraAccess: true,
    locationAccess: true,
},
});

if (!data) {
return <div>No settings found for this user</div>;
}

return (
<div>
    <Index data={data} />
</div>
);
}