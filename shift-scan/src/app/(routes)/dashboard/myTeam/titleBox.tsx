"use client"  
import "@/app/globals.css";
import Backbutton  from "@/components/backButton";
import Image from "next/image";


type Props = {
    title : string
}
export const TitleBox = ({title} : Props) => {
    return (
        <div className=" bg-white h-1/4 w-11/12 flex p-5 rounded-2xl relative "> 
            <Backbutton />
                <div className="bg-white h-full w-full flex flex-col justify-center items-center rounded-2xl relative">
                <h1 className="text-2xl font-bold ">{title}</h1>
            </div>
        </div>
    )
}