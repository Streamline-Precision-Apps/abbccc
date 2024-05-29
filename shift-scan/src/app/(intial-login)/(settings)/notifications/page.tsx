import {useTranslations} from 'next-intl';
import Link from 'next/link';
import React from 'react';
import '../../../globals.css';


export default function notifications() {
  const t = useTranslations('Index');
  return <div>
    <h1>{t('title')}</h1>
    <h2>These are my notifications</h2>
    <div className='' id='notifications'>
      <button>Approved Requests</button>
      <button>Time off Requests</button>
      <button>General Reminders</button>
    </div>
    <div className='' id='permissions'>
      <button>Biometrics</button>
      <button>Camera Access</button>
      <button>Location Access</button>
    </div>
    <div className='' id="changePassword">
      <button>Change password</button>
    </div>

    <Link href={'/settings'}>Return</Link>
    </div>
}