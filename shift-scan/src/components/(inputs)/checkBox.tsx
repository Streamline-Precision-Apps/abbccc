"use client";
import React, { useState } from "react";

const Checkbox: React.FC = () => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="bg-white text-gray-800 font-semibold py-6 px-8 border border-gray-400 font-bold rounded flex items-center w-50 h-35">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="w-8 h-8" // Tailwind classes to make the checkbox larger
      />
      <label className="ml-4 text-xl">{checked ? "Agree" : "Disagree"}</label>{" "}
      {/* Increased margin and text size */}
    </div>
  );
};

export default Checkbox;
