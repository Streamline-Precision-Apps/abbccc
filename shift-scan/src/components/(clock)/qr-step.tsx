import React from 'react';
import { useTranslations } from 'next-intl';
import QR from './qr';
import StepButtons from './step-buttons';
import QR_EQ from './qr-eq';
import { Buttons } from '../(reusable)/buttons';
import { url } from 'inspector';

interface QRStepProps {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  type: string;
  url?: string;
}

const QRStep: React.FC<QRStepProps> = ({ handleAlternativePath, handleNextStep, type, url}) => {
  const t = useTranslations("Clock");

  return (
    <>
    {type === "equipment" ? (<h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">{t('ScanEquipment')}</h1>):
    (<h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">{t('ScanJobSite')}</h1>) 
    }
      <Buttons variant={"red"} size={"small"} href={url}>{t('Cancel')}</Buttons>
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-items-center items-center w-full lg:w-1/3 h-96 p-5 border-4 border-black rounded-lg bg-gr">
        {type === 'equipment' ? ( <QR_EQ handleNextStep={handleNextStep} />) :
          ( <QR handleNextStep={handleNextStep} />)
        }
        </div>
        <button onClick={handleAlternativePath} className="flex justify-center text-lg font-light underline mt-4">
          {t('TroubleScanning')}
        </button>
      </div>
    </>
  );
};

export default QRStep;