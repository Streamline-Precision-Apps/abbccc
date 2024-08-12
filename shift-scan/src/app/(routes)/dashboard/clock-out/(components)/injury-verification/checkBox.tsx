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
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="p-5 w-10"
      />
  );
};

export default Checkbox;
