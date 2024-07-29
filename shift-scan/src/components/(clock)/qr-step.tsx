import React from 'react';
import { useTranslations } from 'next-intl';
import QR from './qr';
import StepButtons from './step-buttons';
import QR_EQ from './qr-eq';
import { Buttons } from '../(reusable)/buttons';

interface QRStepProps {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  type: string;
}

const QRStep: React.FC<QRStepProps> = ({ handleAlternativePath, handleNextStep, type}) => {
  const t = useTranslations("page2");

  return (
    <>
      <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">{t('title-qr')}</h1>
      <Buttons variant={"red"} size={"small"} href="/" >Cancel</Buttons>
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-items-center items-center w-full lg:w-1/3 h-96 p-5 border-4 border-black rounded-lg bg-gr">
        {type === 'equipment' ? ( <QR_EQ handleNextStep={handleNextStep} />) :
          ( <QR handleNextStep={handleNextStep} />)
        }
        </div>
        <button onClick={handleAlternativePath} className="flex justify-center text-lg font-light underline mt-4">
          {t('lN1')}
        </button>
      </div>
    </>
  );
};

export default QRStep;