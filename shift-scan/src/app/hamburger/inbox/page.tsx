import EmptyBase from "@/components/emptyBase";
import TitleBox from "@/components/titleBox";
import TabSection from "@/components/(inputs)/tabSection";

export default function Inbox() {
    
    return (
        <EmptyBase>
            <TitleBox
            title="Inbox"
            titleImg="/Inbox.svg"
            titleImgAlt="Inbox"
            />
            <TabSection/>
        </EmptyBase>  
    )
}
