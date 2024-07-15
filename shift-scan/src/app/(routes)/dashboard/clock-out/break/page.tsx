import Banner from "@/components/banner"
import BreakContent from "@/app/(routes)/dashboard/clock-out/break/breakContent"
import {formatDate} from "@/components/getDate"
import {Footer} from "@/components/footer"
import "@/app/globals.css"
import { TitleBox } from "@/app/(routes)/dashboard/myTeam/titleBox"

export default function BreakHome() {

    const date = formatDate();

    
    return (   
        <>
            <div className="flex-col justify-self-center items-center h-[54rem] w-11/12 md:w-1/2 lg:w-1/3 lg:h-full  absolute inset-1 bg-cover bg-center bg-no-repeat bg-white rounded-lg pb-0">
            <TitleBox title="You're on Break"/>
            {/* <Header /> */}
            <Banner date={date} translation="page1" />
            <BreakContent />
            </div>
        </> 
    )   
}