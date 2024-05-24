import {useTranslations} from 'next-intl';
import Link from 'next/link';
 
export default function Settings() {
  const t = useTranslations('Index');
  return <>
    <h1>{t('title')}</h1>
    <Link href="/inbox">Inbox</Link>
    <Link href='/profile'>Profile</Link>
    <Link href='/notifications'>Notification Settings</Link>
    <Link href='/'>Home</Link>
    </>
}