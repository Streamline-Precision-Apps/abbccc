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
        <div className="w-full flex justify-center flex-col items-center">
        <div className="flex flex-row mb-5 w-3/4 text-center">
            <div className="flex flex-row align-center justify-center bg-blue-500 text-white p-10 border-2 rounded w-1/2 ">
                <h2 className="text-xl mg-auto ">{t('lN5')}</h2>
            </div>
            <div className="flex flex-row bg-blue-500 align-center items-center text-white p-10 border-2 w-1/2 rounded ">
                <h2 className="text-xl mg-auto">{t('lN6')}</h2>
            </div>
        </div>
        </div>
    );}
    else {return (<></>)}
}   