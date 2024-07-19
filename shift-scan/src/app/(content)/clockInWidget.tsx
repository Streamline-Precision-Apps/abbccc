import { User } from "@/lib/types"
import { useTranslations } from "next-intl";
import "../../app/globals.css";
import { useRouter } from "next/navigation";
import { setAuthStep } from "../api/auth";

interface Props {
    user: User
}

export default function ClockInWidget({ user }: Props) {
    const t = useTranslations("page1");
    const router = useRouter();

    const loadNextPage = async () => {
        await setAuthStep("success");
        router.push("/clock/Qr");
    }

    return (
        <>
            <button className="bg-app-green text-4xl font-semibold text-black w-full h-full rounded-lg mb-10 border-2 border-black" 
                onClick={loadNextPage}>
                {t('lN3')}
            </button>
        </>
    );
}
