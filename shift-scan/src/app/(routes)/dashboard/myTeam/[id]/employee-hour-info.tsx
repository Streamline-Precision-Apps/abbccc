import "@/app/globals.css";
import Calendercomponent from "@/components/calender";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import HourData from "./hourdata";

export default function EmployeeHourInfo({params} : Params) {
    return (
        <div className="mx-auto h-auto w-full lg:w-1/2 flex justify-center bg-app-blue rounded-2xl py-10">
            <div className="flex flex-col py-10 px-10 w-11/12 lg:w-1/2 h-1/4 border-2 border-black bg-app-dark-blue rounded-2xl text-white text-3xl">
                <h1 className="text-2xl lg:text-3xl mb-5">Select Date</h1>
                <Calendercomponent>
                <HourData params={params} />
                </Calendercomponent>
            </div>
        </div>
    )
}