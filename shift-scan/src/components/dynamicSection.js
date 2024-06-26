"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';

import '@/app/globals.css';
import Link from 'next/link';



function DynamicSection({children}) {
    const t = useTranslations('PortalLogin');

    return (
        <div className="bg-white p-2 m-3 rounded-xl"> 
            {children}
        </div>
    );
};

export default DynamicSection;