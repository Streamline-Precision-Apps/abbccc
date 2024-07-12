"use client";
import { useRouter } from "next/navigation";

const BackButton = () => {
    const router = useRouter()
    const backButton = () => {
        router.back()
    }
    return (
        <div className="flex items-center absolute inset-0 z-10 p-4 ">
            <button className="bg-app-orange border-black border-2 hover:bg-blue-600 font-bold py-3 p-4 pr-5 rounded shadow-md shadow-black"
            onClick={backButton}>
                <div className="h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-white"/>
            </button>
        </div>

    )
}

export default BackButton