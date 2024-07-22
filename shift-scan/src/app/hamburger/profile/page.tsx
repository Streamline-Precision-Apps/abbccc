// import { useTranslations} from 'next-intl';
// import '@/app/globals.css';
import { Bases } from '@/components/(reusable)/bases';
import SignOutModal from './signOutModal';
import EmployeeInfo from './employeeInfo';


export default function EmployeeProfile() {
return (
        <Bases size={"scroll"}>
            <EmployeeInfo/>
            <SignOutModal/>
        </Bases>
);
};