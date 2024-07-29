"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useScanData } from '@/app/context/JobSiteContext';
import { useSavedCostCode } from '@/app/context/CostCodeContext';
import { useSavedClockInTime } from '@/app/context/ClockInTimeContext';
import { useSavedTimeSheetData } from '@/app/context/TimeSheetIdContext';
import { useSavedUserData } from '@/app/context/UserContext';
import { CreateTimeSheet, updateTimeSheet } from '@/actions/timeSheetActions';
import { Clock } from '../clock';
import { setAuthStep } from '@/app/api/auth';

const VerificationStep: React.FC<{ id: string | null; handleNextStep: () => void, type: string }> = ({ id, type, handleNextStep }) => {
  const t = useTranslations("clock");
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { clockInTime, setClockInTime } = useSavedClockInTime();
  const { savedTimeSheetData, setSavedTimeSheetData } = useSavedTimeSheetData();
  const { savedUserData } = useSavedUserData();
  const [date] = useState(new Date());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // closing previous time sheet before starting new
    if (type === "switchJobs") {
      console.log("entered switch jobs:")
      const localeValue = localStorage.getItem("savedtimeSheetData");
      const id = JSON.parse(localeValue || "{}").id;

      
      const formData = new FormData();
      formData.append('end_time', new Date().toISOString());
      formData.append('total_break_time', (0).toString());
      formData.append('duration',  (0).toString());
      formData.append('timesheet_comments', '');
      formData.append('app_comment', '');
      await updateTimeSheet(formData, id);
      console.log("closing previous time sheet before starting new");

    }

    
    const formData = new FormData();
    formData.append('submit_date', new Date().toISOString());
    formData.append('userId', id?.toString() || '');
    formData.append('date', new Date().toISOString());
    formData.append('jobsite_id', scanResult?.data || '');
    formData.append('costcode', savedCostCode?.toString() || '');
    formData.append('start_time', new Date().toISOString());

    const response = await CreateTimeSheet(formData);
    const result = {id: (response.id).toString()};
    setSavedTimeSheetData(result);
    setAuthStep('success');
    handleNextStep();
  };

  return (
    <>
      <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">{t('title-verify')}</h1>
      <form onSubmit={handleSubmit} className="h-full bg-white flex flex-col items-center rounded-t-2xl">
        <div className="bg-pink-100 h-1/2 w-5/6 flex flex-col items-center p-5 rounded-t-2xl text-xl">
          <h2 className="my-5">Date: {date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</h2>
          <h2 className="my-5">{t('lN2')} "{scanResult?.data}"</h2>
          <h2 className="my-5">{t('lN3')} "{savedCostCode}"</h2>
        </div>
        <Clock time={date.getTime()} />
        <button type="submit" className="bg-app-blue w-1/2 h-1/6 py-4 px-5 rounded-lg text-black font-bold mt-5">
          {t('lN5')}
        </button>
        <input type="hidden" name="submit_date" value={new Date().toISOString()} />
        <input type="hidden" name="userId" value={savedUserData?.id || ''} />
        <input type="hidden" name="date" value={new Date().toISOString()} />
        <input type="hidden" name="jobsite_id" value={scanResult?.data || ''} />
        <input type="hidden" name="costcode" value={savedCostCode?.toString() || ''} />
        <input type="hidden" name="start_time" value={new Date().toISOString()} />
      </form>
    </>
  );
};

export default VerificationStep;