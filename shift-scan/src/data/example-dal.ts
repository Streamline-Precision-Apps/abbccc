import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import "server-only" ;

export default async function getData(){
// add a layer of security

const session = await auth();
if (!session) {
console.error("Not Authorized", 201)
redirect("/signin")
}
    const data = await prisma.user.findFirst()

    return {
        id: data?.id // this will return / filter out some sensitive fields
    };
}
// the purpose of this is to limit / limit the writing of a project