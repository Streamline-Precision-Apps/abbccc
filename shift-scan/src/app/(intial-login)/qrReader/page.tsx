import {useTranslations} from 'next-intl';
import Link from 'next/link';
import React from 'react';
import '../../globals.css';



export default function Inbox() {
  const t = useTranslations('Index');
  return <>
    <Link href="/">Return</Link>
    <h1>{t('title')}</h1>
    <h1>My qr code reader</h1>
    <div className="bg-blue-500 h-64">Hello</div>
    <Link href="/employee/account">after scanner is read, you will go here</Link>
    </>
}