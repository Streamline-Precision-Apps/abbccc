"use client"
import React from 'react';
import CodeFinder from '@/components/(search)/codeFinder';
import StepButtons from './step-buttons';
import { useTranslations } from 'next-intl';

interface CodeStepProps {
datatype: string;
handleNextStep: () => void;

}

const CodeStep: React.FC<CodeStepProps> = ({ datatype, handleNextStep}) => {
const t = useTranslations("clock");



return (
<>
    <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">{t(`title-${datatype}`)}</h1>
    <CodeFinder datatype={datatype} />
    <StepButtons handleNextStep={handleNextStep}/>
</>
);
};

export default CodeStep;