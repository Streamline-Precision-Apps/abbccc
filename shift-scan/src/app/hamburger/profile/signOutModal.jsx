'use client'
import React from 'react'
import Modal from '@/components/modal';
import BasicButton from '@/components/button';
import { useState } from 'react';

export default function signOutModal() {
    const [isOpen, setIsOpen] = useState(false);
    // const t = useTranslations('PortalLogin');

  return (
    <div>
        <button onClick={() => setIsOpen(true)}>
            <p>Sign Out</p>
        </button>

        <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen}>
            Are you sure you want to sign out of your account?
        </Modal>
    </div>
  )
}
