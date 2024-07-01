import { User } from "@/lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Props {
    user: User
}
export default function ManagerWidget({ user }: Props) {
    const t = useTranslations("page1");
    
    if (user.permission === 'ADMIN' || user.permission === 'SUPERADMIN' || user.permission === 'MANAGER' || user.permission === 'PROJECTMANAGER') {
    return (
        <div className="ml-10 mr-10 mb-5 mt-5 flex flex-row space-x-5 w-full h-64">
            <button className="flex justify-center items-center bg-app-blue text-black rounded-lg w-1/2 h-full border-2 border-black">
                <h2 className="text-xl">{t('lN5')}</h2>
            </button>
            <button className="flex justify-center items-center bg-app-blue text-black rounded-lg w-1/2 h-full border-2 border-black">
                <h2 className="text-2xl">{t('lN6')}</h2>
            </button>
        </div>
    );}
    else {return (<></>)}
}   