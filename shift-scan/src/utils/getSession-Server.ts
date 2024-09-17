"use server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function getUser() {
    const session = await auth();
    const userId = session?.user.id;
    const isUser = await fetch(`/api/getIsUser/${userId}`);
    // if unauthenticated return to sign In page
    if (!session) {
        return redirect("/signin");
    }
    // error handling here
    const user = session.user;
    return user;
} 

