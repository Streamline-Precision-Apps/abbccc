import React from 'react';
import { useTranslations } from 'next-intl';
import QR from './qr';
import StepButtons from './step-buttons';

interface QRStepProps {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
}

const QRStep: React.FC<QRStepProps> = ({ handleAlternativePath, handleNextStep }) => {
  const t = useTranslations("page2");

  return (
    <>
      <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">{t('title-qr')}</h1>
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-items-center items-center w-full lg:w-1/3 h-96 p-5 border-4 border-black rounded-lg bg-gr">
          <QR handleNextStep={handleNextStep} />
        </div>
        <button onClick={handleAlternativePath} className="flex justify-center text-lg font-light underline mt-4">
          {t('lN1')}
        </button>
      </div>
      <StepButtons handlePrevStep={() => {}} handleNextStep={handleNextStep} />
    </>
  );
};

export default QRStep;