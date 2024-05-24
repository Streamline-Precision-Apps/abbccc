import {useTranslations} from 'next-intl';

export default function Index() {
    const t = useTranslations('login-page');
    return (
    <>
    <div className='flex flex-col justify-center items-center h-screen w-screen max-w-sm mx-auto'>
    <form action='page-1' method='get' className='flex flex-col gap-4 max-w-18 mx-auto' >
    <h1>{t('title')}</h1>
    <h1>{t('emp-id')}</h1>
    <input type='text' className='border-2' ></input>
    <h1>{t('password')}</h1>
    <input type='password' className='border-2'></input>
    <button type='submit' className='px-4 py-2 bg-blue-500 text-white'>{t('submit')}</button>
    <h1>{t('forgot-password')}</h1>
    <h1>{t('error')}</h1>
    <h1>{t('copyright')}</h1>
    </form>
    </div>
    </>
    );
}