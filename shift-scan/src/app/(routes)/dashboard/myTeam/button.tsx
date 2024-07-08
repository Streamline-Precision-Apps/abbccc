"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type TeamInfoProps = {
    children: ReactNode;
    id: number;
};

export default function TeamInfoButton({ children, id}: TeamInfoProps) {
    const router = useRouter();
    const handler = () => {
        router.push(`/dashboard/myTeam/${id}`);
    }
    return (
        <button className="bg-app-blue w-full h-1/6 py-4 px-5 rounded-lg text-black font-bold mb-5"
        onClick={handler} 
        >
            {children}
        </button>
    );
}