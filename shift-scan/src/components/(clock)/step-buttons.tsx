import React from 'react';

interface StepButtonsProps {
    handleNextStep: () => void;
    isLastStep?: boolean;
}

export default function StepButtons({ handleNextStep, isLastStep}: StepButtonsProps) {
    return (
        <div className="flex justify-center w-full mt-5">
            <button className="bg-app-orange text-black font-bold py-6 px-4 text-4xl rounded-lg" onClick={handleNextStep}>
                {isLastStep ? 'Submit' : 'Continue'}
            </button>
        </div>
    );
};