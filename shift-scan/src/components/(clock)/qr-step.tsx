"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import QR from './qr';
import QR_EQ from './qr-eq';
import { Buttons } from '../(reusable)/buttons';

interface QRStepProps {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  handleChangeJobsite?: () => void;
  handleReturn?: () => void;
  type: string;
  url?: string;
  option?: string;
}

const QRStep: React.FC<QRStepProps> = ({option, handleReturn, handleAlternativePath, handleNextStep, handleChangeJobsite, type, url }) => {
  const t = useTranslations("Clock");
  const validation = localStorage.getItem("jobSite");

  return (
    <>
      {type === "equipment" ? (
        <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">{t('ScanEquipment')}</h1>
      ) : (
        <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">{t('ScanJobSite')}</h1>
      )}
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-items-center items-center w-[500px] h-[500px] pb-5 border-4 border-black rounded-lg bg-black">
          {type === 'equipment' ? (
            <QR_EQ handleNextStep={handleNextStep} />
          ) : (
            <>
            <QR handleNextStep={handleNextStep} />  
            </>)}
        </div>
        {option === "break" ? ( <Buttons onClick={handleReturn} variant={'red'} size={'default'}>
              {"Return To Previous Job and cost code"}
              </Buttons>)
                : (null)}
        {validation ? ( <Buttons onClick={handleChangeJobsite} variant={'orange'} size={'default'}>
              {t('ReturnToJobsite')}
              </Buttons>)
                : (null)} 
        
        <button onClick={handleAlternativePath} className="flex justify-center text-lg font-light underline pb-5">
          {t('TroubleScanning')}
        </button>
      </div>
    </>
  );
};

export default QRStep;