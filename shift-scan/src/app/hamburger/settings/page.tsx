"use server";
import Index from "@/app/hamburger/settings/content";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function Settings() {
const user = cookies().get("user");
const userId = user?.value;


const data = await prisma.userSettings.findUnique({
where: {
    userId: userId,
},
select: {
    userId: true,
    language: true,
    approvedRequests: true,
    timeoffRequests: true,
    GeneralReminders: true,
    Biometric: true,
    cameraAccess: true,
    LocationAccess: true,
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