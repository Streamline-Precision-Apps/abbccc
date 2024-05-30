import {useTranslations} from 'next-intl';
import Link from 'next/link';
import '../../../globals.css';

export default function Settings() {
  const t = useTranslations('Index');
  return <div className='flex flex-col items-center'>
    <h1>{t('title')}</h1>
    <h2 className="text-red-500 mb-4 ">Settings options</h2>
    <div className="bg-blue-500 p-2 flex justify-center w-1/2 mb-8">
      <Link href="/inbox">Inbox</Link>
    </div>

    <div className="bg-blue-500 p-2 flex  justify-center w-1/2 mb-8">
    <Link href='/profile'>Profile</Link>
    </div>
    
    <div className="bg-blue-500 p-2 flex  justify-center w-1/2 mb-8">
    <Link href='/notifications'>Notification Settings</Link>
    </div>
    
    <div className="bg-blue-500 p-2 flex justify-center w-1/2 mb-8">
    <Link href='/'>Home</Link>
    </div>

    </div>
}