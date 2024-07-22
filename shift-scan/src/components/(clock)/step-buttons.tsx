import React from 'react';

interface StepButtonsProps {
  handlePrevStep: () => void;
  handleNextStep: () => void;
  isLastStep?: boolean;
}

const StepButtons: React.FC<StepButtonsProps> = ({ handlePrevStep, handleNextStep, isLastStep }) => {
  return (
    <div className="flex justify-between w-full mt-4">
      <button className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg" onClick={handlePrevStep}>
        Back
      </button>
      <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg" onClick={handleNextStep}>
        {isLastStep ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};

export default StepButtons;