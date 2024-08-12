import '@/app/globals.css';
import { Bases } from "@/components/(reusable)/bases";
import TabSection from "@/components/(inputs)/tabSection";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";

export default function Testing() {
    
    return (
        <Bases>
            <Sections>
                <Forms state="disabled" variant={"default"} size={"default"}>
                    <Labels variant="default" type="title">Phone Number</Labels>
                    <Inputs variant="default" type="default" state="disabled"></Inputs>
                </Forms>
            </Sections>
        </Bases>  
    )
}