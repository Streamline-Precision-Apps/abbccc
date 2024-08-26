'use client';

import React, { useState } from 'react';
import { Modals } from '@/components/(reusable)/modals';
import { Buttons } from '@/components/(reusable)/buttons';
import { useTranslations } from 'next-intl';
import { updateTimeSheetLogOut } from '@/actions/timeSheetActions';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function SignOutModal( { userid }: { userid: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Hamburger');
  const router =  useRouter();


  const clockOut = async () => {
    try {
    const ts = localStorage.getItem('savedtimeSheetData');
    if (ts) {
      const timesheet = JSON.parse(ts);
      const timesheetId = timesheet.id?.toString();
      if (timesheetId) {
        const formData = new FormData();
        formData.append('id', timesheetId);
        formData.append('end_time', new Date().toISOString());
        const data = await updateTimeSheetLogOut(formData);
        console.log(data);
        localStorage.clear();
        signOut({ callbackUrl: '/signin' });
      } else {
        console.error('Timesheet ID is missing.');
      }
    } else {
      console.error('No timesheet data found in localStorage.');
    }
  } catch (error) {
    console.error(error);
  }
  };

  return (
    <div>
      <Buttons onClick={() => setIsOpen(true)} variant="red" size="default">
        <p>{t("SignOut")}</p>
      </Buttons>

      <Modals handleClose={() => setIsOpen(false)} clockOut={ async () => await clockOut()} isOpen={isOpen} type="signOut" variant={"default"} size={"sm"}>
        {t("SignOutConfirmation")}
      </Modals>
    </div>
  );
}