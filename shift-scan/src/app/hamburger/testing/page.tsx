import '@/app/globals.css';
import { Bases } from "@/components/(reusable)/bases";
import TabSection from "@/components/(inputs)/tabSection";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";
import { Forms } from "@/components/(reusable)/forms";

export default function Testing() {
    
    return (
        <Bases>
            <Sections>
                <Forms />
            </Sections>
        </Bases>  
    )
}