"use client";
import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  const handleCheckboxChange = () => {
    onChange(!checked);
  };

  return (
    <div className="bg-app-darkblue text-black font-semibold py-6 font-bold rounded flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="w-8 h-8" // Tailwind classes to make the checkbox larger
      />
      {/* Increased margin and text size */}
    </div>
  );
};

export default Checkbox;
