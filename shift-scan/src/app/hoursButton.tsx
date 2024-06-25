import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useSession } from 'next-auth/react';
import { ManagerHoursLogic} from "./managerHoursLogic";
import { EmployeeHoursLogic} from "./employeeHoursLogic";
import { useSavedPayPeriodHours } from "./context/SavedPayPeriodHours";

interface HoursProps {
    permission: string;
}
interface EmployeeHoursLogicProps {
    // define the props for EmployeeHoursLogic here
    payPeriodHours: number;
}


// this button is in charge of displaying the correct view for the user.
export default function Hours({permission }: HoursProps) {
    const t = useTranslations("page1");
    const session = useSession();

    if (permission === 'ADMIN' || permission === 'SUPERADMIN' || permission === 'MANAGER' || permission === 'PROJECTMANAGER') {
        return (
            <ManagerHoursLogic />
        );
    } 
    else {
        return (
            <EmployeeHoursLogic />
        );
    }
} 
