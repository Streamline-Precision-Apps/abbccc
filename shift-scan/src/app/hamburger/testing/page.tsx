import '@/app/globals.css';
import { Bases } from "@/components/(reusable)/bases";
import TabSection from "@/components/(inputs)/tabSection";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Contents } from '@/components/(reusable)/contents';
import { Tabs } from '@/components/(reusable)/tabs';

export default function Testing() {
    
    return (
        <Bases>
            <Contents size={"default"}>
                <Sections size={"titleBox"}>
                    <TitleBoxes
                    type='noIcon'
                    title={"Inbox"}
                    titleImg="/Inbox.svg"
                    titleImgAlt="Inbox"
                    />
                </Sections>
                <Tabs/>
            </Contents>
        </Bases>  
    )
}