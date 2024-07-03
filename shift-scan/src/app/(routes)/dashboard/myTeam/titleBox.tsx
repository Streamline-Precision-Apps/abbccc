"use client"  
import Backbutton  from "@/components/backButton";

type Props = {
    title : string | undefined
}
export const TitleBox = ({title} : Props) => {
    return (
        <div className=" bg-white h-1/4 w-full flex p-5 rounded-2xl"> 
                <Backbutton />
                <div className="bg-white h-full w-full flex justify-center items-center p-5 rounded-2xl">
                <h1 className="text-4xl font-bold ">{title}</h1>
        </div>
        </div>
    )
}