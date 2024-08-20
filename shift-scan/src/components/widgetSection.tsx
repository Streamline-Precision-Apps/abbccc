import ClockInWidget from "@/app/(content)/clockInWidget"
import { User } from "@/lib/types"
import '@/app/globals.css';
import { Manager } from "@/app/(routes)/dashboard/manager";
import { Grids } from "./(reusable)/grids";

interface Props {
    user: User;
    display: boolean;
    locale: string;
    option ?: string
}

export default function WidgetSection({ user, display, locale, option}: Props) {
    if (
        user?.permission === "ADMIN" ||
        user?.permission === "SUPERADMIN" ||
        user?.permission === "MANAGER" ||
        user?.permission === "PROJECTMANAGER"
      ) {
        return (
            <>
                <Manager show={true} />
                <ClockInWidget 
                    user={user} 
                    option={option}  
                    locale={locale}
                    manager={true}
                    />
            </>
    );
}   else {
        return (
            <>
                <ClockInWidget 
                    user={user} 
                    option={option}  
                    locale={locale}
                    manager={false}
                    />
            </>
        )
    }
}