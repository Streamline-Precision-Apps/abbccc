"use client";
import React, { useState, useEffect } from "react";
import classNames from "classnames";

const LocaleToggleSwitch = ({
  data,
  onChange,
}: {
  data: boolean;
  onChange: (value: boolean) => void;
}) => {
  const [isSelected, setIsSelected] = useState(data);

  useEffect(() => {
    setIsSelected(data); // Update the local state when props change
  }, [data]);

  const handleClick = () => {
    const newValue = !isSelected;
    setIsSelected(newValue);
    onChange(newValue);
  };

  return (
    <div
      onClick={handleClick}
      className="flex w-20 h-10 cursor-pointer bg-blue-900 border-black border-2 justify-center items-center rounded-xl self-end"
    >
      <span
        className={classNames(
          "w-9 h-9 rounded-xl border-black border-2 transition-all duration-500 ",
          {
            "ml-10": isSelected,
            "bg-green-500": isSelected,
            "mr-10": !isSelected,
            "bg-red-500": !isSelected,
          }
        )}
      />
    </div>
  );
};

export default LocaleToggleSwitch;
