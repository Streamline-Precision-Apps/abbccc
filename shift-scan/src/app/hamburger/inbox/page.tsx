import { Bases } from "@/components/(reusable)/bases";
import TabSection from "@/components/(inputs)/tabSection";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";
import { useTranslations } from "next-intl";

export default function Inbox() {
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
