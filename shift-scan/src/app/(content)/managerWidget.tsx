import { User } from "@/lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    user: User
}
export default function ManagerWidget({ user }: Props) {
    const t = useTranslations("page1");
    const router = useRouter();

    const loadTeamPage = () => {
        router.push("/dashboard/myTeam");
    }
    const loadGeneratorPage = () => {
        router.push("/dashboard/qrGenerator");
    }
    
    if (user.permission === 'ADMIN' || user.permission === 'SUPERADMIN' || user.permission === 'MANAGER' || user.permission === 'PROJECTMANAGER') {
    return (
        <div className="ml-10 mr-10 mb-5 mt-5 flex flex-row space-x-5 w-full h-64">
            <button className="flex justify-center items-center bg-app-blue text-black rounded-lg w-1/2 h-full border-2 border-black text-2xl"
            onClick={loadGeneratorPage}
            >
                {t('lN5')}
            </button>
            <button className="flex justify-center items-center bg-app-blue text-black rounded-lg w-1/2 h-full border-2 border-black text-2xl"
            onClick={loadTeamPage}
            >
                {t('lN6')}
            </button>
        </div>
    );}
    else {return (<></>)}
}   