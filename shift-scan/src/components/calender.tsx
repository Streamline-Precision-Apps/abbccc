"use client";
import Image from "next/image";
import React, { ReactNode, useState } from "react";
import Modal from "./modal";
import CalenderModel from "@/app/(routes)/dashboard/myTeam/[id]/calenderModel";

type Props = {
    children: ReactNode;
}

export default function Calender({ children }: Props) {
    // there is a model usecase and a date select usecase
    // the date select usecase should be in the model usecase
    // the resoning behind this is to get the selected value of the calendar and pass it to the model usecase.
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState(new Date());


    // Below are methods for the calender interaction section of the app and they are:
    // a button to open the modal, the modal, and the calender itself
    // you also see children below this is becaus ewe want to pass the serverside data to the calender model without altering the calender model itself.

    return (
        <>
        <button className="w-full bg-white p-5 h-1/2 flex flex-row items-center rounded-2xl text-2xl lg:text-4xl font-bold justify-evenly " 
        onClick={() => setIsOpen(true)} >
        <Image src={"/profile-icon.png"} alt="Team Image" width={80} height={80} className="rounded-full" />
        <h1 className="text-3xl font-bold text-black">{date.toLocaleDateString()}</h1>
        </button>
        
        <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen}>
            <CalenderModel setDate={setDate} /> 
        </Modal>
    
        {children}
        </>
    );
}