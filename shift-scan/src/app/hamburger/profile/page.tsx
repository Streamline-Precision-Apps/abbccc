// import { useTranslations} from 'next-intl';
// import '@/app/globals.css';
import EmptyBase from '@/components/emptyBase';
import SignOutModal from './signOutModal';
import EmployeeInfo from './employeeInfo';


export default function EmployeeProfile() {
return (
    <div> 
        <EmptyBase>
            <EmployeeInfo/>
            <SignOutModal/>
        </EmptyBase>
    </div>
);
};