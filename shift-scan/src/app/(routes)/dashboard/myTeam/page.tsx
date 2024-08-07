import "@/app/globals.css";
import TeamCards from "./teamCards";
import {cookies} from "next/headers"
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";


export default function MyTeam(){

    return (
        <Bases variant={"default"}>
            <Contents size={"default"}>
                <Sections size={"titleBox"}>
                    <TitleBoxes title="My Team" titleImg="/myTeam.svg" titleImgAlt="Team" variant={"default"} size={"default"}/>
                </Sections>
                <Sections size={"dynamic"}>
                    <TeamCards />
                </Sections>
            </Contents>
        </Bases>
    )

}