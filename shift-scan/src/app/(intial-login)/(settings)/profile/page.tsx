import {useTranslations} from 'next-intl';
import Link from 'next/link';
import React from 'react';
import '../../../globals.css';


export default function profile() {
  const t = useTranslations('Index');
  return <div className='flex flex-col items-center '>
    <h1>{t('title')}</h1>
    <Link className='flex justify-center p-5 border w-1/2 bg-red-500' href='/settings'>Return</Link>
    <div  className='flex justify-center  border w-64 h-64 rounded-full bg-gray-300  mt-10'>
      <img className='' src="" alt="Profile Picture"></img>
    </div>
    <div className='border-2 w-1/2'>
      <h2 className='text-center mb-4 p-5'>Name</h2>
      <h2 className='text-center mb-4 p-5'>Email</h2>
      <h2 className='text-center mb-4 p-5'>Phone</h2>
      <div>
        <h2 className='text-center mb-4 p-5'>Safety Training</h2>
      </div>
    </div>
    <div className='flex justify-center  border w-1/2 bg-red-500 p-5 mt-10 mb-10'> 
      <Link href={'/'}>Return</Link>
    </div>
    </div>
}