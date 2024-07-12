"use client"  
import "@/app/globals.css";
import Backbutton  from "@/components/backButton";
import Image from "next/image";


type Props = {
    title : string
}
export const TitleBox = ({title} : Props) => {
    return (
        <div className=" bg-white h-1/4 w-full flex p-5 rounded-2xl relative "> 
            <Backbutton />
                <div className="bg-white h-full w-full flex flex-col justify-center items-center rounded-2xl relative">
                <Image className="rounded-full" src="/profile-icon.png" alt="Team Image" width={125} height={125}/>
                <h1 className="text-2xl font-bold ">{title}</h1>
            </div>
        </div>
    )
}