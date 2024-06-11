"use client";
import React, { FormEventHandler } from 'react';
import { signIn } from "next-auth/react";
import { useTranslations} from 'next-intl';
import LocaleCheckBox from '../../../components/localeCheckBox';
import '@/app/globals.css';
import Link from 'next/link';


export default function Index() {
    const t = useTranslations('PortalLogin');
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        await signIn('credentials', {
            redirect: false,
            username: data.get('username') as string,
            password: data.get('password') as string,
        });
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>  
            <h1>{t('Title')}</h1>
            <input
            name="username"
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            placeholder={t('lN1')}
            />
            <input
            name="password"
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="password"
            placeholder={t('lN2')}
            />
            <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
            {t('btn-signIn')}
            </button>
            <span>
            <LocaleCheckBox />
            </span>
            <h2>{t('btn-forgot')}</h2>
            <h2>{t('lN4')}</h2>
        </form>
        </div>
    );
    }