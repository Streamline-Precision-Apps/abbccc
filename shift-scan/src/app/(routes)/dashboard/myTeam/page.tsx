
import Image from "next/image";
import "@/app/globals.css";
import { TitleBox } from "./titleBox";
import TeamCards from "./teamCards";
import TeamInfoButton from "./button";
export default function MyTeam(){

    
    return (
        <div className='mt-16 h-screen lg:w-1/2 block m-auto'>
            <div className="bg-app-Darkblue h-full flex flex-col items-center p-5 rounded-t-2xl">
            <TitleBox />
                <div className=" mt-5 bg-white h-full w-full flex justify-center items-center p-5 rounded-2xl overflow-y-auto">
                    <TeamCards />
                </div>
            </div>
        </div>
    )

}