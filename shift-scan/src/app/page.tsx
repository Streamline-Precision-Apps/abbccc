"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useSession } from "next-auth/react";
import PreLogin from "@/app/preLogin";
import { isDashboardAuthenticated } from "@/app/api/auth";
// this is to help typescript work
import {User, CustomSession} from "@/lib/types";
import { useSavedPayPeriodHours} from "@/app/context/SavedPayPeriodHours";
import Name from "@/app/name";



export default function Index() {
    const t = useTranslations("page1");
    const { data: session } = useSession() as { data: CustomSession | null };
    const { setPayPeriodHours } = useSavedPayPeriodHours();


    // this give a  default value to the user object before the data is fetched
    const [user, setUser] = useState<User>({
        id: "",
        firstName: "",
        lastName: "",
        payPeriodHours: "",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        permission: "",
    });

    useEffect(() => {
        if (session && session.user) {
            setUser({
                id: session.user.id,
                firstName: session.user.firstName || "Display Name",
                lastName: session.user.lastName,
                payPeriodHours: "24", // Data will be fetched separately.
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                permission: session.user.permission,
            });
            setPayPeriodHours(user.payPeriodHours || "0");
        }
    }, [session]);


    
    // this use effect provides the user with a way back to the dash board if page reload redirects them to the login page
    // this key can only be removed through logging out
    useEffect(() => {
        if (isDashboardAuthenticated()) {
            window.location.href = "/dashboard";
        }
    }, []);

    if (user.permission === "ADMIN" || user.permission === "MANAGER" || user.permission === "PROJECTMANAGER") {
        return (
            <div className="flex flex-col items-center space-y-4">
                <Name translation={"page1"} user={user} /> 
                <PreLogin user={user} permission={user.permission} />
            </div>
        );
    } else if (user.permission === "SUPERADMIN") {
        return (
            <div className="flex flex-col items-center space-y-4">
                <h1>Super Admin Dashboard here</h1>
                {/*I still need to work on this */}
            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-center space-y-4">
                <Name translation="page1" user={user} /> 
                <PreLogin user={user} permission={user.permission} />
            </div>
        );
    }
}

