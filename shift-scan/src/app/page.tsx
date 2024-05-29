import {useTranslations} from 'next-intl';
import Link from 'next/link';
import './globals.css';

export default function Index() {
    const t = useTranslations('Index');
    return <div className='flex flex-col items-center'>
        <h1>{t('title')}</h1>
        <h2 className="text-red-500 mb-4 ">Pre-Clocked In page</h2>
        <div className="bg-blue-500 p-2 flex-box  justify-center w-1/2 mb-8">
            <Link className='flex justify-center p-5 border' href="/settings">Settings</Link>
        </div>
        <div className="bg-blue-500 p-2 flex-box  justify-center w-1/2 mb-8">
            <button className='justify-center p-5 w-full border'>Total Hours</button>
        </div>
        <div className="bg-blue-500 p-2 flex-box  justify-center w-1/2 mb-8">
        <Link className='flex justify-center p-5 border' href='/qrReader'>Clock In</Link>
        </div>
    </div>
}