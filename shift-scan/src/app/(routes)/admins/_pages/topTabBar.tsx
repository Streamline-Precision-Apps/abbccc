"use client";
import { useState, useEffect } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { Grids } from "@/components/(reusable)/grids";
import { useSession } from "next-auth/react";
import AdminNavBar from "@/app/(routes)/admins/_pages/AdminNavBar";
import { Texts } from "@/components/(reusable)/texts";

const TopTabBar = () => {
const { data: session } = useSession();
const firstName = session?.user.firstName;
const lastName = session?.user.lastName;
const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920);

// Effect to update screen width on resize
useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
}, []);

return (
<Holds className="h-full col-span-10 bg-white bg-opacity-20">
    <Grids cols="8" gap="2" className="w-full flex md:grid items-center">
        {/* Logo Section */}
        <Holds position="row" className="bg-white h-full col-span-1 px-1 rounded-r-[10px] min-w-[100px]">
            <Images titleImg="/logo.svg" titleImgAlt="Logo" className="m-auto h-[40px]" />
            {screenWidth < 1000 ?  (
                // If screen width < 1200px, show only the image
                null
            ):( 
                <Images titleImg="/person.svg" titleImgAlt="Logo" className="m-auto h-[40px]" />
            )}
        </Holds>
        {/* Banner Message (Only Visible on md and Larger) */}
        <Holds className="bg-white col-span-4 rounded-[10px] bg-opacity-20 py-2 hidden md:flex h-[45px] justify-center items-center">
            <Texts size="p6">Hey {firstName} {lastName}, welcome to Shift Scan!</Texts>
        </Holds>
        {/* AdminNavBar (Expands When Banner Disappears) */}
        <Holds className="col-span-3 flex-1 flex justify-end w-full">
            <AdminNavBar />
        </Holds>
    </Grids>
</Holds>
);
};

export default TopTabBar;
