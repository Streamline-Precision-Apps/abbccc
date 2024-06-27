import Banner from "@/components/banner"
import Content from "@/app/(content)/content"
import {formatDate} from "@/components/getDate"
import {Footer} from "@/components/footer"
import TestingComponents from "@/components/testingComponents"
import "@/app/globals.css"

export default function Home() {
    const date = formatDate();
    return (    
        <div className="flex justify-self-center  w-full absolute inset-0 bg-cover bg-center bg-no-repeat bg-app-dark-blue">
            <div className="justify-self-center mt-16 w-1/3 h-full absolute inset-1 bg-cover bg-center bg-no-repeat bg-white">
            <TestingComponents />
            {/* <Header /> */}
            <Banner date={date} translation="page1" />
            <Content />
            <Footer pages="page1" />
            </div>
        </div>
    )   
}