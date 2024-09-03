"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import QR from './qr';
import QR_EQ from './qr-eq';
import { Buttons } from '../(reusable)/buttons';
import { Texts } from '../(reusable)/texts';
import { useRouter } from 'next/navigation';
import { Titles } from '../(reusable)/titles';

interface QRStepProps {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  handleChangeJobsite?: () => void;
  handleReturn?: () => void;
  type: string;
  url: string;
  option?: string;
}

const QRStep: React.FC<QRStepProps> = ({option, handleReturn, handleAlternativePath, handleNextStep, handleChangeJobsite, type, url }) => {
  const t = useTranslations("Clock");
  const validation = localStorage.getItem("jobSite");
  const router = useRouter();
  return (
    <>
      {type === "equipment" ? (
        <Titles variant={"modal"} size={"h1"}>{t('ScanEquipment')}</Titles>
      ) : (
        <Titles variant={"modal"} size={"h1"}>{t('ScanJobSite')}</Titles>
      )}
        <div className="bg-white mx-5 rounded-2xl p-3 border-4 border-black">
          {type === 'equipment' ? (
            <QR_EQ handleNextStep={handleNextStep} />
          ) : (
            <>
            <QR handleNextStep={handleNextStep} url={url}  />  
            </>)}
        </div>
        <button onClick={handleAlternativePath}>
          <Texts variant={"link"} size={"p4"}>{t('TroubleScanning')}</Texts>
        </button>
        {option === "break" ? ( <Buttons onClick={handleReturn} variant={'red'} size={'default'}>
              {"Return To Previous Job and cost code"}
              </Buttons>)
                : (null)}
        {validation ? ( <Buttons onClick={handleChangeJobsite} variant={'green'} size={'default'}>
              {t('ReturnToJobsite')}
              </Buttons>)
                : (null)} 
    </>
  );
};

export default QRStep;