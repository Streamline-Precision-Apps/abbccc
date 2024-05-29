import {useTranslations} from 'next-intl';
import Link from 'next/link';
import React from 'react';
import '../../../globals.css';


export default function Inbox() {
  const t = useTranslations('Index');
  return <div className='flex flex-col items-center'>
    <h1 className="text-align-center text-2xl text-red-500 mb-4">This is my inbox</h1>
    <Link className='flex justify-center p-5 border' href='/settings'>Return</Link>
    <h1 className="text-align-center text-2xl text-red-500 mb-4">Requests</h1>
    <div className='flex gap-2'>

    <div className="bg-blue-500 p-5 flex justify-center mb-8 w-40">Sent</div> 
    <div className="bg-blue-500 p-5 flex justify-center mb-8 w-40">Recieved</div>
    
    </div>

  </div>
}