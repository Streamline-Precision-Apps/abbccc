import "@/app/globals.css";
import {cookies} from "next/headers"
import Qr from "../../clock/Qr/page";

export default function MyTeam(){

    return (
    <>
    <Qr returnRouterName={"/dashboard"} processName={"Switch Jobs"}  />
    </>
    )
}