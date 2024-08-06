"use server";
import Index from "@/app/hamburger/settings/content";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function Settings() {
    const u = cookies().get("user");
    const user = u ? JSON.parse(u.value) : null;
    const userId = user ? user.id : null;

    const data = prisma.userSettings.findMany({
        where: {
            userId : userId
        }
    })

    return (
        <div>
            <Index data={data} />
        </div>
    )
}