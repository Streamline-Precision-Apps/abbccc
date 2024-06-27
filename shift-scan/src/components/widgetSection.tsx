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
        <div className="mt-10 justify-items-center ">
            <ManagerWidget user={user} />
            <ClockInWidget user={user} />
        </div>
    ) : null;  
}