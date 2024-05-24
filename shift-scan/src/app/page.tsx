import {useTranslations} from 'next-intl';
import Link from 'next/link';
 
export default function Index() {
  const t = useTranslations('Index');
  return <>
    <h1>{t('title')}</h1>;
   <Link href="/settings">Settings</Link>
   <Link href='/total-hours'>Total Hours</Link>
   <Link href='/start-day'>Clock In</Link>
  
   </>
}