"use client";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useScanData } from '@/app/context/JobSiteContext';
import { useSavedCostCode } from '@/app/context/CostCodeContext';
import { useSavedClockInTime } from '@/app/context/ClockInTimeContext';
import { useSavedTimeSheetData } from '@/app/context/TimeSheetIdContext';
import { useSavedUserData } from '@/app/context/UserContext';
import { CreateTimeSheet, updateTimeSheetBySwitch } from '@/actions/timeSheetActions';
import { Clock } from '../clock';
import { setAuthStep } from '@/app/api/auth';
import UserId from '../userId';


const VerificationStep: React.FC<{ id: string | undefined; handleNextStep: () => void, type: string }> = ({ id, type, handleNextStep}) => {
  const t = useTranslations("clock");
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { clockInTime, setClockInTime } = useSavedClockInTime();
  const { savedTimeSheetData, setSavedTimeSheetData } = useSavedTimeSheetData();
  const { savedUserData } = useSavedUserData();
  const [date] = useState(new Date());
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try{
    e.preventDefault();
    // closing previous time sheet before starting new
    if (id === null ) {
      throw new Error("User id does not exist");
    }
    if (type === "switchJobs") {
      try{
      console.log("The type is ", type);
      console.log("entered switch jobs:")
      // pulls the timesheet id from local storage and pasrses it to a string
      const localeValue = localStorage.getItem("savedtimeSheetData");
      const t_id = JSON.parse(localeValue || "{}").id;
      // declare a new FormData object due to having two different form data inputs
      const formData2 = new FormData();
      formData2.append('id', t_id?.toString() || '');
      formData2.append('end_time', new Date().toISOString());
      formData2.append('total_break_time', (0).toString());
      formData2.append('timesheet_comments', '');
      formData2.append('app_comment', 'Switched jobs');
      // updates the time sheet
      await updateTimeSheetBySwitch(formData2);
      // beginning new time sheet process
      const formData = new FormData();
      formData.append('submit_date', new Date().toISOString());
      formData.append('userId', id?.toString() || '');
      formData.append('date', new Date().toISOString());
      formData.append('jobsite_id', scanResult?.data || '');
      formData.append('costcode', savedCostCode?.toString() || '');
      formData.append('start_time', new Date().toISOString());
      // creates a new time sheet & waiting for response
      const response = await CreateTimeSheet(formData);
      const result = {id: (response.id).toString()};
      setSavedTimeSheetData(result);
      setAuthStep('success');
      handleNextStep();
    }
    catch (error) { 
      console.log(error);
    }
  }
  // if it is a new time sheet and not switch jobs
  // this portion of verification step is implemented in the clock component
    else {
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
  }}
  catch (error) {
    console.log(error);
  }
} ;

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