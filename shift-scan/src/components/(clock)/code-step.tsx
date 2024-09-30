"use client";
import React from 'react';
import CodeFinder from '@/components/(search)/codeFinder';
import StepButtons from './step-buttons';
import { useTranslations } from 'next-intl';
import { Titles } from '../(reusable)/titles';

type CodeStepProps = {
    datatype: string;
    handleNextStep: () => void;
}

export default function CodeStep({ datatype, handleNextStep} : CodeStepProps){
    const t = useTranslations("Clock");

    return (
        <>
            <Titles size={"h1"}>{t(`Title-${datatype}`)}</Titles>
            <CodeFinder datatype={datatype} />
            <StepButtons handleNextStep={handleNextStep}/>
        </>
    );
};