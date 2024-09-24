"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import CustomCheckbox from "@/components/(inputs)/checkBox";
import { Texts } from "@/components/(reusable)/texts";
import { useState } from "react";


export default function Test() {
  //-----------------------------------------------------------------------
  const [isChecked, setIsChecked] = useState(false);
  // Pass the fetched data to the client-side Content component
  return (
    <Bases >
    <Contents >
    <Holds>
      <Texts >Test</Texts>
      <div className=" w-1/2 p-4">
      <CustomCheckbox
        label="Agree to terms"
        checked={isChecked}
        onChange={setIsChecked}
      />
    </div>
      </Holds>
      </Contents>
    </Bases>
  );
}