import { useTranslations } from 'next-intl';
import '@/app/globals.css';
import UseModal from '@/components/modal';
import Banner from '@/components/banner';
import HoursButton from '@/app/hoursButton';
import { LoginButton, LogoutButton } from '@/app/api/auth';

export default function EmployeePreLogin({ user }: any) {
    const t = useTranslations('page1');    
    
return(
    <div className='flex flex-col items-center space-y-4'>
    <UseModal />
    {/* This button displays the login and logout buttons are testcases
    for the login and logout functionality and to view user permissions 
    and we will reassign the buttons to different parts of the app */}
    <LoginButton />
    <LogoutButton />
    <br />
    {/* This banner displays the date and name of the employee */}
    <Banner date={String(user.date)} translation="page1" />
    <h2 className='text-3xl'>{t('Name', { firstName: user.firstName, lastName: user.lastName })}</h2>

    {/* This hour button displays the hours and the clock in button in order to hide the clock in button during a setToggle */}
    <HoursButton permission={user.permission} />
    <br />
    <h2>{t('lN4')}</h2>
</div>
    )
}
