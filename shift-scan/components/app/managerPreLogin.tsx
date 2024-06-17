import { useTranslations } from 'next-intl';
import '@/app/globals.css';
import UseModal from '../../components/UI/modal';
import Banner from '../../components/app/banner';
import HoursButton from '../../components/app/hoursButton';
import { LoginButton, LogoutButton } from '../../src/app/api/auth';

export default function ManagerPreLogin({ user }: any) {
    const t = useTranslations('page1'); 
    const permission = String(user.permission);
    console.log(permission);
    


return(   
    <div className='flex flex-col items-center space-y-4'>
    <h1>Manager is logged here!</h1>
    <UseModal />
    <h1>Login under:</h1>
    <LoginButton />
    <LogoutButton />
    <br />
    <Banner date={String(user.date)} />
    <h2 className='text-3xl'>{t('Name', { firstName: user.firstName, lastName: user.lastName })}</h2>
    <HoursButton permission={permission} payPeriodHours={Number(user.payPeriodHours)} />
    <br />
    <h2>{t('lN4')}</h2>
</div>
    )
}
