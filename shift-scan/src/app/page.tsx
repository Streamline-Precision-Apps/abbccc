import Banner from "@/components/banner"
import Content from "@/app/(content)/content"
import {formatDate} from "@/components/getDate"
import "@/app/globals.css"
import { Header } from "@/components/header"
import { Bases } from "@/components/(reusable)/bases"
import { Sections } from "@/components/(reusable)/sections"
import { Headers } from "@/components/(reusable)/headers"
import { useTranslations } from "next-intl"
import { Footers } from "@/components/(reusable)/footers"

export default function Home() {

    const t = useTranslations("Home");
    const f = useTranslations("Footer");

    return (   
        <Bases variant={"default"} size={"default"}>
            <Header/>
            <Sections size={"default"}>
            <Headers variant={"relative"} size={"default"}></Headers>
                <Content />
            <Footers >{f("Copyright")}</Footers>
            </Sections>
        </Bases>
    )   
}