import "@/app/globals.css";
import TeamCards from "./teamCards";
import {cookies} from "next/headers"
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";
import { Bases } from "@/components/(reusable)/bases";


export default function MyTeam(){

    return (
        <Bases>
                <Sections size={"titleBox"}>
                    <TitleBoxes title="My Team" titleImg="/profile.svg" titleImgAlt="Team" variant={"default"} size={"default"}/>
                </Sections>
                <Sections size={"dynamic"}>
                    <TeamCards />
                </Sections>
        </Bases>
    )

}