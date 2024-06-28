import Banner from "@/components/banner"
import Content from "@/app/(content)/content"
import {formatDate} from "@/components/getDate"
import {Footer} from "@/components/footer"
import TestingComponents from "@/components/testingComponents"
import "@/app/globals.css"
import { Header } from "@/components/header"

export default function Home() {
    const date = formatDate();
    return (   
        <>
            <div className="flex-col justify-self-center items-center h-[54rem] w-11/12 md:w-1/2 lg:w-1/3 lg:h-full  absolute inset-1 bg-cover bg-center bg-no-repeat bg-white rounded-lg pb-0">
            <Header/>
            {/* <Header /> */}
            <Banner date={date} translation="page1" />
            <Content />
            </div>
        </> 
    )   
}