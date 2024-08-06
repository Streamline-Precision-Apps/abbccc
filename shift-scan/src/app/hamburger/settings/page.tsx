"use server";
import Index from "@/app/hamburger/settings/content";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

type Data = {
language: string;
approvedRequests: boolean;
timeoffRequests: boolean;
GeneralReminders: boolean;
Biometric: boolean;
cameraAccess: boolean;
LocationAccess: boolean;
};

export default async function Settings() {
const u = cookies().get("user");
const userId = u

if (!userId) {
return <div>No user found</div>;
}

const data = await prisma.userSettings.findUnique({
where: {
    userId: userId.value,
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