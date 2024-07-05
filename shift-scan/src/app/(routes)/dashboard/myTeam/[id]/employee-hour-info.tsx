import "@/app/globals.css";
import Calendercomponent from "@/components/calender";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import HourData from "./hourdata";


export default function EmployeeHourInfo({params} : Params) {
    return (
        <div className="mx-auto h-auto w-full lg:w-1/2 flex flex-col justify-center bg-gradient-to-b from-app-dark-blue via-app-dark-blue to-app-blue py-20 border-l-2 border-r-2 border-black  ">
            <div className="flex flex-col py-5 px-2 w-11/12 mx-auto h-1/4 border-2 border-black rounded-2xl text-white text-3xl">
                <h1 className="text-2xl pl-5 lg:text-3xl mb-5">Select Date</h1>
                <Calendercomponent>
                    <HourData params={params} />
                </Calendercomponent>
            </div>
        </div>
    )
}