import { User } from "@/lib/types"
import { useTranslations } from "next-intl";
import Link from "next/link";
import "../../app/globals.css";


interface Props {
    user: User
}
export default function ClockInWidget({ user }: Props) {
    const t = useTranslations("page1");
    return (
        <div className="">
            <div>
            <Link className="w-full flex justify-center " href="/clock/Qr">
        <button className='bg-app-green text-5xl text-white w-3/4 h-64 p-5 gap-2 rounded-lg'>
            {t('lN3')}
        </button>
        </Link>
        </div>
        </div>
    );
}   

