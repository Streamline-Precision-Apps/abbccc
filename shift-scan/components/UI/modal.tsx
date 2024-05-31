"use client";
import { useTranslations} from 'next-intl';

import React, {useEffect, useState} from 'react';
import Modal from '../Modal'
import '../../src/app/globals.css';


export default function UseModal (){

    const [isModalOpen, setIsOpen] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
    };
    const t = useTranslations('PreClocked');
return (
    <div className="flex justify-center items-center ">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded" onClick={openModal}>
            image
        </button>
        <Modal show={isModalOpen} onClose ={closeModal} >
            <button className= " flex-box text-white p-5 ">Inbox</button>
            <button className= "flex-box text-white p-5">Profile</button>
            <button className= "flex-box text-white p-5">Notifications</button>
        </Modal>
    </div>
    )
}
