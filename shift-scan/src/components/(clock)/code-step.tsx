"use client";
import React from 'react';
import CodeFinder from '@/components/(search)/codeFinder';
import StepButtons from './step-buttons';
import { useTranslations } from 'next-intl';
import { Titles } from '../(reusable)/titles';
import { Grids } from '../(reusable)/grids';
import { Holds } from '../(reusable)/holds';
import { Contents } from '../(reusable)/contents';

type CodeStepProps = {
    datatype: string;
    handleNextStep: () => void;
}

export default function CodeStep({ datatype, handleNextStep} : CodeStepProps){
    const t = useTranslations("Clock");

    return (
        <>
            <Contents width={"section"}>
                <Grids rows={"7"} gap={"5"} className='my-5'>
                    <Holds className='row-span-1'>
                        <Titles size={"h1"}>{t(`Title-${datatype}`)}</Titles>
                    </Holds>
                    <Holds className="row-span-5 border-[3px] border-black rounded-[10px]">
                        <CodeFinder datatype={datatype}/>
                    </Holds>
                    <Holds className="row-span-1 h-full ">
                        <StepButtons handleNextStep={handleNextStep}/>
                    </Holds>
                </Grids>
            </Contents>
        </>
    );
};