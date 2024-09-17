"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function getUser() {
    const session = useSession();
    // if unauthenticated return to sign In page
    if (session.status === "unauthenticated") {
        return redirect("/signin");
    }
    // error handling here
    const user = session.data?.user;
    return user;
} 

