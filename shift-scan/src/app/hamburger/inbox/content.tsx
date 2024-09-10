"use client"
import { Bases } from "@/components/(reusable)/bases";
import TabSection from "@/components/(inputs)/tabSection";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";
import { useTranslations } from "next-intl";

type content = {
    sentContent : sentContent[];
    recievedContent? : recievedContent[];
}

type recievedContent = {
    id: number;
    date: Date;
    requestedStartDate: Date;
    requestedEndDate: Date;
    requestType: string;
    comments: string;
    mangerComments: string | null;
    approved: boolean;
    employee_id: string;
    createdAt: Date;
    updatedAt: Date;
}
type sentContent = {
    id: number;
    date: Date;
    requestedStartDate: Date;
    requestedEndDate: Date;
    requestType: string;
    comments: string;
    mangerComments: string | null;
    approved: boolean;
    employee_id: string;
    createdAt: Date;
    updatedAt: Date;
}
export default function Content( { sentContent, recievedContent } : content ) {
    const t = useTranslations("Hamburger");
    return (
        <Bases>
            <Sections size={"titleBox"}>
                <TitleBoxes
                title={t("Inbox")}
                titleImg="/Inbox.svg"
                titleImgAlt="Inbox"
                />
            </Sections>
            <TabSection/>
        </Bases>  
    )
}
