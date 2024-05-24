import {useTranslations} from 'next-intl';
import Link from 'next/link';
import React from 'react';



export default function Inbox() {
  const t = useTranslations('Index');
  return <>
    <h1>{t('title')}</h1>
    <h1>My qr code reader</h1>
    <Link href="/employee/account">after scanner is read, you will go here</Link>
    </>
}