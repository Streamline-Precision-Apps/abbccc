"use client";
import React from 'react';
import  CostCodeFinder from '../../../../components/clock/costcodeFInder';
import useBeforeUnload from '../../../../components/app/refreshWarning';
import { useTranslations } from 'next-intl';


const CostCodePage: React.FC = () => {
  const t = useTranslations('page5');
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    const message = t('lN6');
    event.returnValue = message;
    return message;
  }
  useBeforeUnload(handleBeforeUnload);
  return (
    <div>
      < CostCodeFinder />
    </div>
  );
};

export default CostCodePage;
