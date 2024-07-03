"use client";
import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
}
export default function Calender( { children }: Props ) {
    const handler = () => {
        console.log("hi");
    }
    return (
        <>
        <button className="w-full bg-white p-5 h-1/2 flex flex-row items-center rounded-2xl text-2xl lg:text-4xl font-bold justify-evenly ">
        <Image src={"/profile-icon.png"} alt="Team Image" width={80} height={80} className="rounded-full" />
        <div className="w-1/2 h-3/4 flex justify-center m-auto items-center p-5 rounded-2xl bg-white text-black"
        onClick={handler}
        >
            <h1>7/3/2024</h1>
        </div>
        </button>
        {children}
        </>
    );
}