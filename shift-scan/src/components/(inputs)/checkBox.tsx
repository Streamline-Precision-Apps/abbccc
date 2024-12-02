"use client";

import { ChangeEvent } from "react";

export interface CheckboxProps {
  disabled?: boolean;
  defaultChecked?: boolean;
  id: string;
  name: string;
  label?: string;
  size?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const CheckBox = ({
  disabled,
  defaultChecked,
  id,
  name,
  label,
  size = 4,
  onChange,
}: CheckboxProps) => (
  <div className="w-full flex justify-center">
    <input
      className={`
      peer relative appearance-none shrink-0 border-4 border-black mt-1 bg-white shadow-[8px_8px_0px_grey]
      focus:outline-none focus:ring-offset-0 focus:ring-1 focus:ring-blue-100
      checked:bg-app-green checked:border-4 rounded-[10px]
      disabled:border-steel-400 disabled:bg-steel-400
      `}
      type="checkbox"
      id={id}
      name={name}
      defaultChecked={defaultChecked}
      checked={defaultChecked}
      disabled={disabled}
      onChange={onChange}
      style={{ width: `${size}em`, height: `${size}em` }} // Dynamically setting size with inline styles
    />
    <svg
      className="absolute pointer-events-none hidden peer-checked:block stroke-black mt-1 outline-none animate-wave"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: `${size}em`, height: `${size}em` }} // Dynamically setting size for SVG
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    {label && <label htmlFor={id}>{label}</label>}
  </div>
);

export default CheckBox;
