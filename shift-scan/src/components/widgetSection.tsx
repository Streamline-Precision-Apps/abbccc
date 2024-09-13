import ClockInWidget from "@/app/(content)/clockInWidget"
import { User } from "@/lib/types"
import '@/app/globals.css';
import Manager from "@/app/(routes)/dashboard/manager";

interface Props {
    user: User;
    display: boolean;
    locale: string;
    option ?: string
}

export default function WidgetSection({ user, display, locale, option}: Props) {
return (
<>
{/*Ternary operator to check if the user has permission to see the widget*/}
    {(user?.permission === "ADMIN" || user?.permission === "SUPERADMIN" || user?.permission === "MANAGER" )
    ? <Manager show={true} /> : null
    }
        <ClockInWidget 
            user={user} 
            option={option}  
            locale={locale}
            manager={(user?.permission === "ADMIN" || user?.permission === "SUPERADMIN" || user?.permission === "MANAGER" || user?.permission === "PROJECTMANAGER" ) ? true : false}
            />
</>
);
} 