import { Bases } from "@/components/(reusable)/bases";
import TabSection from "@/components/(inputs)/tabSection";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";

export default function Inbox() {
    
    return (
        <Bases>
            <Sections size={"titleBox"}>
                <TitleBoxes
                title="Inbox"
                titleImg="/Inbox.svg"
                titleImgAlt="Inbox"
                />
            </Sections>
            <TabSection/>
        </Bases>  
    )
}
