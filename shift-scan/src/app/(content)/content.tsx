"use client"
import '@/app/globals.css';
import { useTranslations } from "next-intl";
import AppUser from "@/app/(content)/name"
import Hours from "@/app/(content)/hours";
import WidgetSection from "@/components/widgetSection";
import { useSession } from "next-auth/react";
import { CustomSession, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { useSavedPayPeriodHours } from '../context/SavedPayPeriodHours';

// I put this into the content page to allow all the pages 
// to have access to the user object
export default function Content() {
    const t = useTranslations("page1");
    const { data: session } = useSession() as { data: CustomSession | null };
    // const {data: token} = useSession()as { data: CustomSession | null };
    const { payPeriodHours, setPayPeriodHours } = useSavedPayPeriodHours();
    const [toggle, setToggle] = useState(true);

    
    const [user, setUser] = useState<User>({
        id: "",
        name:" ",
        email: "",
        image: "",
        firstName: "",
        lastName: "",
        permission: "",
        });

    useEffect(() => {
        if (session && session.user) {
            setUser({
                id : session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                permission: session.user.permission
            });
            setHoursContext();
        }
    }, [session]);
        const handler = () => {
            setToggle(!toggle);
            console.log(toggle);
        }; 
        // rerun at clock out to get updated hours
        const setHoursContext = () => {
        const totalhours = 20.45;
            setPayPeriodHours(String(totalhours));
        }
        
    return (
        <>
            <AppUser user={user} />
            <Hours setToggle={handler} display={toggle} />
            <WidgetSection user={user} display={toggle}/>
        </>
    );
}      

