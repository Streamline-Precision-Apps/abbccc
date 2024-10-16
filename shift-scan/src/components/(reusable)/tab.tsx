import { button } from "@nextui-org/react";
import React from "react";
import classNames from "classnames";
import { Texts } from "../(reusable)/texts";

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
        "px-4 py-4 min-w-[100px] rounded-[10px] h-full flex items-center justify-center rounded-b-none font-bold  border-t-transparent border-t-4 w-full",
        {
          "bg-white": isTabActive,
          "bg-gray-400": !isTabActive,
        }
      )}
    >
      <Texts>{tabLabel}</Texts>
    </button>
  );
}
