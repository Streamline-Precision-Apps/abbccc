import "@/app/globals.css";
import {cookies} from "next/headers"
import Qr from "@/components/(clock)/qr";
import Clock from "@/app/(routes)/clock/page";

export default async function Scan(){
    return (
    <>
    <Clock type={"equipment"}/>
    </>
    )
}