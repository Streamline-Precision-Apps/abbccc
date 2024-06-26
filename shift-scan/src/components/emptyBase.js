"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';

import Link from 'next/link';
import '@/app/globals.css';


function EmptyBase({children}) {
    const t = useTranslations('PortalLogin');

    return (
        <div className="w-full h-screen bg-gradient-to-b from-blue-900 to-blue-300 p-1 pt-10"> 
            {children}
        </div>
    );
};

export default EmptyBase;