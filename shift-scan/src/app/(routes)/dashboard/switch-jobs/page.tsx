import "@/app/globals.css";
import {cookies} from "next/headers"
import Qr from "@/components/(clock)/qr";
import Clock from "../../clock/page";

export default async function MyTeam(){
    return (
    <>
    <Clock type={"switchJobs"}/>
    </>
    )
}