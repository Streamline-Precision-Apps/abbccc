'use client';
import React, { useEffect, useState } from 'react';
import { Modals } from '@/components/(reusable)/modals';
import { Buttons } from '@/components/(reusable)/buttons';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';

export default function SignOutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Hamburger');

  const signoutHandler = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Buttons onClick={() => setIsOpen(true)} variant="red" size="default">
        <p>{t("SignOut")}</p>
      </Buttons>

      <Modals handleClose={signoutHandler} isOpen={isOpen} type="signOut" variant={"default"} size={"sm"}>
        {t("SignOutConfirmation")}
      </Modals>
    </div>
  );
}