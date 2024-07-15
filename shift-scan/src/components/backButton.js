"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const BackButton = () => {
    const router = useRouter()
    const backButton = () => {
        router.back()
    }
    return (
        <button onClick={backButton}>
            <Image src={"/backArrow.svg"} alt="Team Image" width={60} height={60} />
        </button>
    )
}

export default BackButton