'use client'
import React from 'react'
import { Modals } from '@/components/(reusable)/modals';
import { useState } from 'react';
import { Buttons } from '@/components/(reusable)/buttons';

export default function signOutModal() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Hamburger');

  return (
    <div>
        <Buttons onClick={() => setIsOpen(true)} variant="red" size="default">
            <p>{t("SignOut")}</p>
        </Buttons>

        <Modals handleClose={() => setIsOpen(false)} isOpen={isOpen} type="signOut" variant={"default"} size={"sm"}>
            {t("SignOutConfirmation")}
        </Modals>
    </div>
  )
}
