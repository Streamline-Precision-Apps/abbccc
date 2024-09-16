"use client";
import React from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({ checked, onChange }: CheckboxProps) => {
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
