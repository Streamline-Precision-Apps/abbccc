import ClockInWidget from "@/app/(content)/clockInWidget"
import ManagerWidget from "@/app/(content)/managerWidget"
import { User } from "@/lib/types"
import '@/app/globals.css';

interface Props {
    user: User;
    display: boolean;
}

export default function WidgetSection({ user, display }: Props) {
    return display ? (
        <div className="grid grid-cols-1 grid-rows-2 gap-4 w-11/12 h-1/2 m-auto ">
            <ManagerWidget user={user} />
            <ClockInWidget user={user} />
        </div>
    ) : null;  
}