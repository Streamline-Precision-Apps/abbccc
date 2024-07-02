"use client";
import { ReactNode } from "react";

type TeamInfoProps = {
    children: ReactNode;
    id: number;
};

export default function TeamInfoButton({ children, id}: TeamInfoProps) {
    const handler = () => {
        console.log("clicked on id: ", id);
    }
    return (
        <button className="bg-app-blue w-full h-1/6 py-4 px-10 rounded-lg text-white font-bold mb-5"
        onClick={handler} 
        >
            {children}
        </button>
    );
}