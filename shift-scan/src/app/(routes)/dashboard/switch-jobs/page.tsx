import "@/app/globals.css";
import {cookies} from "next/headers"
import Qr from "@/components/(clock)/qr";
import Clock from "../../clock/page";

// this page refrence clock but has its own direction that it goes to
export default async function MyTeam(){
    return (
    <>
    <Clock type={"switchJobs"}/>
    </>
    )
}