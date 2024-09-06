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
import { Contents } from '../(reusable)/contents';
import { verify } from 'crypto';
import { Labels } from '../(reusable)/labels';
import { Inputs } from '../(reusable)/inputs';
import { Forms } from '../(reusable)/forms';
import { Images } from '../(reusable)/images';
import { Texts } from '../(reusable)/texts';


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
    <>
      <TitleBoxes title={t('VerifyJobSite')} titleImg="/new/clock-in.svg" titleImgAlt="Verify" variant="row" size="default" type="row" />
      <Forms size={"fit"} onSubmit={handleSubmit}  >
        <Bases variant={"pinkCard"} size={"pinkCard"} className='relative'>
        <Buttons variant={"icon"} size={null} type="submit" >
        <Images titleImg={'/new/downArrow.svg'} titleImgAlt={'downArrow'} variant={'submitCard'} size={"downArrow"}/>
        </Buttons>
        <Contents variant="default" size={"listTitle"}>
        <Labels variant="default" size={"default"} >
        <Texts size={"p4"} variant="left">
          {t('Date-label')}
        </Texts>
        <Inputs state="disabled" variant={"white"} data={date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}/>
        </Labels>

        <Labels variant="default" size={"default"} >
          <Texts size={"p4"} variant="left">
            {t('JobSite-label')}
            </Texts>
        <Inputs state="disabled" name="jobsite_id" variant={"white"} data={scanResult?.data || ''}/>
        </Labels>

        <Labels variant="top" size={"default"} >
        <Texts size={"p4"} variant="left">
          {t('CostCode-label')}
        </Texts>
        <Inputs state="disabled" name="costcode" variant={"white"} data={savedCostCode?.toString() || ''}/>
        </Labels>
        </Contents>
        </Bases>
        <Bases variant={null} size={"box"} className='relative'>
          <Bases variant={"blueboxTop"} size={"blueboxTop"} >
          </Bases>
          <Bases variant={"blueboxTop2"} size={"blueboxTop"} >
          </Bases>
              <Bases variant={"blueBox"} size={"blueBox"} >
              <Buttons type="submit" className="bg-app-green mx-auto flex justify-center w-full h-full py-4 px-5 rounded-lg text-black font-bold mt-5">
              <Clock time={date.getTime()} />
              </Buttons>
              </Bases>
        </Bases>
        <Inputs type="hidden" name="submit_date" value={new Date().toISOString()} />
        <Inputs type="hidden" name="user_id" value={savedUserData?.id || ''} />
        <Inputs type="hidden" name="date" value={new Date().toISOString()} />
        <Inputs type="hidden" name="start_time" value={new Date().toISOString()} />
      </Forms>

    </>
  );
};

export default VerificationStep;