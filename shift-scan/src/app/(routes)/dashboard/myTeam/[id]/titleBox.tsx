"use client"  
import "@/app/globals.css";
import Backbutton  from "@/components/backButton";
import Image from "next/image";


type Props = {
    title : string | undefined
}
export const TitleBoxId = ({title} : Props) => {
    return (
        <div className=" bg-white h-1/4 w-full flex p-5 rounded-2xl"> 
                <Backbutton />
                <div className="bg-white h-full w-full flex flex-col justify-center items-center p-5 rounded-2xl">
                <Image className="rounded-full" src="/profile-icon.png" alt="Team Image" width={150} height={150}/>
                <h1 className="text-5xl font-bold ">{title}</h1>
        </div>
        </div>
    )
}