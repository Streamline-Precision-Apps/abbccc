import ClockInWidget from "@/app/(content)/clockInWidget"
import ManagerWidget from "@/app/(content)/managerWidget"
import { User } from "@/lib/types"
import '@/app/globals.css';

interface Props {
    user: User;
    display: boolean;
    locale: string;
    option ?: string
}

export default function WidgetSection({ user, display, locale, option}: Props) {
    return display ? (
        <div className={`"grid grid-cols-3 grid-rows-2 gap-4 w-full m-auto" ${ user?.permission !== "USER" ? "h-1/2": "h-11/12"}`}>
            <ManagerWidget user={user} />
            <ClockInWidget user={user} option={option}  locale={locale}/>
        </div>
    ) : null;  
}