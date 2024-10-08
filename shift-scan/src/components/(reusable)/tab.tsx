import { button } from "@nextui-org/react";
import React from "react";
import classNames from "classnames";

interface TabType {
  isTabActive?: boolean;
  tabLabel: string;
  onClick?: () => void;
}

export function Tab({ isTabActive, tabLabel, onClick }: TabType) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "px-4 min-w-[100px] rounded-2xl h-full flex items-center justify-center rounded-b-none font-bold -mb-[.0px] border-t-transparent border-t-4 z-10 w-full m-0",
        {
          "bg-white": isTabActive,
          "bg-gray-400": !isTabActive,
        }
      )}
    >
      {tabLabel}
    </button>
  );
}
