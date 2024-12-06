"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setTagsAttach: Dispatch<SetStateAction<boolean>>;
};
export function CostCodeLeft({}: Props) {
  return <Holds background={"white"} className="w-2/5 h-full"></Holds>;
}
