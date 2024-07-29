import React from 'react';

interface StepButtonsProps {
  handleNextStep: () => void;
  isLastStep?: boolean;
}
// this is the continue button
const StepButtons: React.FC<StepButtonsProps> = ({ handleNextStep, isLastStep}) => {
  return (
    <div className="flex justify-center w-full mt-4">
      <button className="bg-app-orange text-black font-bold py-6 px-4 text-4xl rounded-lg" onClick={handleNextStep}>
        {isLastStep ? 'Submit' : 'Continue'}
      </button>
    </div>
  );
};

export default StepButtons;