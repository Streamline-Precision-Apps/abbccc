"use client";
import React, { FC } from "react";

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CustomCheckbox: FC<CustomCheckboxProps> = ({ label, checked, onChange, disabled = false }) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer select-none">
      {/* Hidden Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="hidden"
      />
      {/* Custom Styled Checkbox */}
      <div
        className={`w-5 h-5 flex items-center justify-center border-2 rounded-md transition-all ${
          checked ? "bg-blue-500 border-blue-500" : "border-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      {/* Checkbox Label */}
      <span className={`text-sm ${disabled ? "text-gray-500" : "text-gray-800"}`}>
        {label}
      </span>
    </label>
  );
};

export default CustomCheckbox;