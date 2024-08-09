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
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="w-8 h-8" // Tailwind classes to make the checkbox larger
      />
    </div>
  );
};

export default Checkbox;
