"use client";
import React from 'react';
import CodeFinder from '@/components/(search)/codeFinder';
import StepButtons from './step-buttons';
import { useTranslations } from 'next-intl';
import { Titles } from '../(reusable)/titles';

interface CodeStepProps {
    datatype: string;
    handleNextStep: () => void;
}

const CodeStep: React.FC<CodeStepProps> = ({ datatype, handleNextStep}) => {
    const t = useTranslations("Clock");

    return (
        <>
            <Titles>{t(`Title-${datatype}`)}</Titles>
            <CodeFinder datatype={datatype} />
            <StepButtons handleNextStep={handleNextStep}/>
        </>
    );
};

export default CodeStep;