import React from 'react';
import { useTranslations } from 'next-intl';
import QR from './qr';
import QR_EQ from './qr-eq';

interface QRStepProps {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  type: string;
  url?: string;
}

const QRStep: React.FC<QRStepProps> = ({ handleAlternativePath, handleNextStep, type, url }) => {
  const t = useTranslations("Clock");

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
            <QR handleNextStep={handleNextStep} />
          )}
        </div>
        <button onClick={handleAlternativePath} className="flex justify-center text-lg font-light underline pb-5">
          {t('TroubleScanning')}
        </button>
      </div>
    </>
  );
};

export default QRStep;