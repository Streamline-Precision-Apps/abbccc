import { useState, useEffect } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";
import { getActivePage } from "@/utils/admin/navigationUtils";
import { usePathname } from "next/navigation";

const AdminNavBar = () => {
const pathname = usePathname();
const { isPersonnelPage, isAssetsPage, isReportsPage, isHomePage, isInboxPage } = getActivePage(pathname);
const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920);

// Effect to update screen width on resize
useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
}, []);

return (
<Holds className="col-span-3 h-full">
    <Holds position="row" className="h-full w-full">
    <Buttons
        shadow="none"
        className={`${isHomePage ? "bg-app-blue w-full h-[75px]" : "bg-app-gray h-[60px] w-[100px]"} rounded-t-none border-none mr-2`}
        href="/admins"
    >
        {isHomePage ? (
        screenWidth < 1300 ? ( 
            // If screen width < 1200px, show only the image
            <Images titleImg="/home.svg" titleImgAlt="Home Icon" className="m-auto h-[40px] min-w-[60px]"/>
        ) : (
            // Default full view
            <Holds position={"row"} className="justify-center items-center h-full">
                <Titles size="h5">Dashboard Home</Titles>
                <Images size={"30"} titleImg="/home.svg" titleImgAlt="Home Icon" className=" h-[30px] pl-3 mb-1" />
            </Holds>
        )) : (
            // Default behavior when not on home page
            <Images titleImg="/home.svg" titleImgAlt="Home Icon" className="m-auto h-[40px] min-w-[50px]"/>
        )}
    </Buttons>

    <Buttons
    shadow="none"
    className={`${isPersonnelPage ? "bg-app-blue w-full h-[75px]" : "bg-app-gray h-[60px] w-[100px]"} rounded-t-none border-none mr-2`}
    href="/admins/personnel"
>
    {isPersonnelPage ? (
        screenWidth < 1300 ? (
            <Images titleImg="/team.svg" titleImgAlt="Personnel Icon" className="m-auto h-[40px] min-w-[60px]" />
        ) : (
            <Holds position="row" className="justify-center items-center h-full">
                <Titles size="h5">Personnel</Titles>
                <Images size="30" titleImg="/team.svg" titleImgAlt="Personnel Icon" className="h-[30px] pl-3 mb-1" />
            </Holds>
        )
    ) : (
        <Images titleImg="/team.svg" titleImgAlt="Personnel Icon" className="m-auto h-[40px] min-w-[60px]" />
    )}
</Buttons>

<Buttons
    shadow="none"
    className={`${isAssetsPage ? "bg-app-blue w-full h-[75px]" : "bg-app-gray h-[60px] w-[100px]"} rounded-t-none border-none mr-2`}
    href="/admins/assets"
>
    {isAssetsPage ? (
        screenWidth < 1300 ? (
            <Images titleImg="/jobsite.svg" titleImgAlt="Assets Icon" className="m-auto h-[40px] min-w-[60px]" />
        ) : (
            <Holds position="row" className="justify-center items-center h-full">
                <Titles size="h5">Assets</Titles>
                <Images size="30" titleImg="/jobsite.svg" titleImgAlt="Assets Icon" className="h-[30px] pl-3 mb-1" />
            </Holds>
        )
    ) : (
        <Images titleImg="/jobsite.svg" titleImgAlt="Assets Icon" className="m-auto h-[40px] min-w-[60px]" />
    )}
</Buttons>

<Buttons
    shadow="none"
    className={`${isReportsPage ? "bg-app-blue w-full h-[75px]" : "bg-app-gray h-[60px] w-[100px]"} rounded-t-none border-none mr-2`}
    href="/admins/reports"
>
    {isReportsPage ? (
        screenWidth < 1300 ? (
            <Images titleImg="/form.svg" titleImgAlt="Reports Icon" className="m-auto h-[40px] min-w-[60px]" />
        ) : (
            <Holds position="row" className="justify-center items-center h-full">
                <Titles size="h5">Reports</Titles>
                <Images size="30" titleImg="/form.svg" titleImgAlt="Reports Icon" className="h-[30px] pl-3 mb-1" />
            </Holds>
        )
    ) : (
        <Images titleImg="/form.svg" titleImgAlt="Reports Icon" className="m-auto h-[40px] min-w-[60px]" />
    )}
</Buttons>

<Buttons
    shadow="none"
    className={`${isInboxPage ? "bg-app-blue w-full h-[75px]" : "bg-app-gray h-[60px] w-[100px]"} rounded-t-none border-none mr-2`}
    href="/admins/inbox"
>
    {isInboxPage ? (
        screenWidth < 1300 ? (
            <Images titleImg="/form.svg" titleImgAlt="Inbox Icon" className="m-auto h-[40px] min-w-[60px]" />
        ) : (
            <Holds position="row" className="justify-center items-center h-full">
                <Titles size="h5">Inbox</Titles>
                <Images size="30" titleImg="/form.svg" titleImgAlt="Inbox Icon" className="h-[30px] pl-3 mb-1" />
            </Holds>
        )
    ) : (
        <Images titleImg="/form.svg" titleImgAlt="Inbox Icon" className="m-auto h-[40px] min-w-[60px]" />
    )}
</Buttons>

    </Holds>
</Holds>
);
};

export default AdminNavBar;
