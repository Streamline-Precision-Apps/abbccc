import React from 'react';
import { Images } from '../(reusable)/images';
import { Buttons } from '../(reusable)/buttons';

const ShiftScanIntro = ({ handleNextStep }: { handleNextStep: any }) => {
  return (
    <>
      <p >Welcome to shift scan,</p>
      <p >Let's start off by taking your preferences!</p>
      
      <Images
        titleImg={'/logo.svg'}
        titleImgAlt={'Logo'}/>
    <Buttons onClick={handleNextStep} variant={'default'} size={'default'}>Next</Buttons>
    </>

  );
};

export default ShiftScanIntro;
