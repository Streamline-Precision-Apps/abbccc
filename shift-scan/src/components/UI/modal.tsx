"use client";
import { useTranslations} from 'next-intl';

import React, {useEffect, useState} from 'react';
import Modal from '@/components/Modal';
import '@/app/globals.css';


export default function UseModal (){

    const [isModalOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
    };
    const t = useTranslations('modal-settings');
return (
    <div className="flex justify-center items-center ">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded" onClick={openModal}>
            {t('Settings')}
        </button>
        <Modal show={isModalOpen} onClose ={closeModal} >
            {/* We will need to change these to the icons rather then names */}
            <button className= " flex-box text-white p-5 ">{t('btn-inbox')}</button>
            <button className= "flex-box text-white p-5">{t('btn-profile')}</button>
            <button className= "flex-box text-white p-5">{t('btn-notifications')}</button>
        </Modal>
    </div>
    )
}
