import {useTranslations} from 'next-intl';
import Link from 'next/link';
import React from 'react';



export default function Inbox() {
  const t = useTranslations('Index');
  return <>
    <h1>{t('title')}</h1>
    <h1>These are my Hours by each day in the pay period</h1>
    </>
}