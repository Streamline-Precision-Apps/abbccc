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
import { TitleBoxes } from '../(reusable)/titleBoxes';
import { Sections } from '../(reusable)/sections';
import { Bases } from '../(reusable)/bases';


const VerificationStep: React.FC<{ id: string | undefined; handleNextStep: () => void, type: string }> = ({ id, type, handleNextStep}) => {
  const t = useTranslations("Clock");
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
    <div className="flex flex-col items-center w-[500px] h-[800px] m-auto">
      <TitleBoxes title={t('VerifyJobSite')} titleImg="/clockin.svg" titleImgAlt="Verify" variant="row" size="default" type="row" />
      <form onSubmit={handleSubmit} >
        <TitleBoxes title={t('Date-label')} titleImg="/clockin.svg" titleImgAlt="Verify" variant="default" size="default" type='titleOnly' >
          <Sections size={"dynamic"}>
          {date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
          </Sections>
        </TitleBoxes>
        <TitleBoxes title={t('JobSite-label')} titleImg="/clockin.svg" titleImgAlt="Verify" variant="default" size="default" type='titleOnly' >
          <Sections size={"dynamic"}>
          {scanResult?.data}
          </Sections>
        </TitleBoxes>
        <TitleBoxes title={t('CostCode-label')} titleImg="/clockin.svg" titleImgAlt="Verify" variant="default" size="default" type='titleOnly' >
          <Sections size={"dynamic"}>
          {savedCostCode}
          </Sections>
        </TitleBoxes>
        <button type="submit" className="bg-app-green mx-auto w-full h-16 py-4 px-5 rounded-lg text-black font-bold mt-5">
        <Clock time={date.getTime()} />
        </button>

        <input type="hidden" name="submit_date" value={new Date().toISOString()} />
        <input type="hidden" name="userId" value={savedUserData?.id || ''} />
        <input type="hidden" name="date" value={new Date().toISOString()} />
        <input type="hidden" name="jobsite_id" value={scanResult?.data || ''} />
        <input type="hidden" name="costcode" value={savedCostCode?.toString() || ''} />
        <input type="hidden" name="start_time" value={new Date().toISOString()} />
      </form>
    </div>
  );
};

export default VerificationStep;