"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';

import '@/app/globals.css';
import Link from 'next/link';



function DynamicSection({children}) {
    const t = useTranslations('PortalLogin');
    return (
        <div className="bg-white w-full flex px-10 items-center rounded-2xl"> 
            {children}
        </div>
    );
};

export default DynamicSection;