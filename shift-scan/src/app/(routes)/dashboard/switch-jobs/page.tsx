import "@/app/globals.css";
import {cookies} from "next/headers"
import Qr from "../../clock/Qr/page";
import Clock from "../../clock/page";

export default function MyTeam(){
    return (
    <>
    <Clock type={"switchJobs"} id={""}/>
    </>
    )
}