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
import { exit } from 'process';
import { Buttons } from '../(reusable)/buttons';


const VerificationStep: React.FC<{ id: string | undefined; handleNextStep: () => void, type: string, option?: string }> = ({ id, type, handleNextStep, option}) => {
  const t = useTranslations("Clock");
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { clockInTime, setClockInTime } = useSavedClockInTime();
  const { savedTimeSheetData, setSavedTimeSheetData } = useSavedTimeSheetData();
  const { savedUserData } = useSavedUserData();
  const [date] = useState(new Date());

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
    e.preventDefault();

    if (id === null) {
      throw new Error("User id does not exist");
    }

    if (type === "switchJobs") {
      try {
        console.log("The type is ", type);
        console.log("entered switch jobs:");

        const localeValue = localStorage.getItem("savedtimeSheetData");
        const t_id = JSON.parse(localeValue || "{}").id;
        const formData2 = new FormData();
        formData2.append('id', t_id?.toString() || '');
        formData2.append('end_time', new Date().toISOString());
        formData2.append('timesheet_comments', '');
        formData2.append('app_comment', 'Switched jobs');

        await updateTimeSheetBySwitch(formData2);

        const formData = new FormData();
        formData.append('submit_date', new Date().toISOString());
        formData.append('user_id', id?.toString() || '');
        formData.append('date', new Date().toISOString());
        formData.append('jobsite_id', scanResult?.data || '');
        formData.append('costcode', savedCostCode?.toString() || '');
        formData.append('start_time', new Date().toISOString());

        const response = await CreateTimeSheet(formData);
        const result = { id: (response.id).toString() };
        setSavedTimeSheetData(result);
        setAuthStep('success');
        handleNextStep();
      } catch (error) {
        console.log(error);
      }
    } else {
      const formData = new FormData();
      formData.append('submit_date', new Date().toISOString());
      formData.append('user_id', id?.toString() || '');
      formData.append('date', new Date().toISOString());
      formData.append('jobsite_id', scanResult?.data || '');
      formData.append('costcode', savedCostCode?.toString() || '');
      formData.append('start_time', new Date().toISOString());

      const response = await CreateTimeSheet(formData);
      const result = { id: (response.id).toString() };
      setSavedTimeSheetData(result);
      setAuthStep('success');
      handleNextStep();
    };
  } catch (error) {
    console.log(error);
  }
};
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
        <Buttons type="submit" className="bg-app-green mx-auto w-full h-16 py-4 px-5 rounded-lg text-black font-bold mt-5">
        <Clock time={date.getTime()} />
        </Buttons>

        <input type="hidden" name="submit_date" value={new Date().toISOString()} />
        <input type="hidden" name="user_id" value={savedUserData?.id || ''} />
        <input type="hidden" name="date" value={new Date().toISOString()} />
        <input type="hidden" name="jobsite_id" value={scanResult?.data || ''} />
        <input type="hidden" name="costcode" value={savedCostCode?.toString() || ''} />
        <input type="hidden" name="start_time" value={new Date().toISOString()} />
      </form>
    </div>
  );
};

export default VerificationStep;