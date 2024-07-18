import "@/app/globals.css";
import { TitleBox } from "./titleBox";
import TeamCards from "./teamCards";
import {cookies} from "next/headers"

export default function MyTeam(){

    return (
        <div className=' h-screen lg:w-1/3 block m-auto'>
            <div className="bg-app-dark-blue h-full  flex flex-col items-center rounded-t-2xl">
            <TitleBox title="My Team" />
                <div className=" mt-5 bg-white h-full w-11/12 flex justify-center items-center rounded-2xl overflow-y-auto">
                    <TeamCards />
                </div>
            </div>
        </div>
    )

}