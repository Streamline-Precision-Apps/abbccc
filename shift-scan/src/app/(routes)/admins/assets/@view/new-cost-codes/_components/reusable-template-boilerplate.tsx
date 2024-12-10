"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";

export default function XXXXX({ params }: { params: { id: string } }) {
  const tagId = params.id;

  return (
    <Holds className="w-full h-full ">
      <ReusableViewLayout
        custom={true}
        header={<EditXXXXXHeader />}
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        mainLeft={<EditXXXXXMainLeft />}
        mainRight={<EditXXXXXMainRight />}
        footer={<EditXXXXXFooter />}
      />
    </Holds>
  );
}

export function EditXXXXXHeader() {
  return (
    <Holds background={"white"} className="w-full h-full col-span-2">
      <Texts className="text-white font-bold text-2xl">Edit Tag</Texts>
    </Holds>
  );
}

export function EditXXXXXMainLeft() {
  return (
    <Holds background={"white"} className="w-full h-full ">
      <Texts className="text-white font-bold text-2xl">Edit Tag</Texts>
    </Holds>
  );
}

export function EditXXXXXMainRight() {
  return (
    <Holds background={"white"} className="w-full h-full">
      <Texts className="text-white font-bold text-2xl">Edit Tag</Texts>
    </Holds>
  );
}
export function EditXXXXXFooter() {
  return (
    <Holds background={"white"} className="w-full h-full col-span-2">
      <Texts className="text-white font-bold text-2xl">Edit Tag</Texts>
    </Holds>
  );
}
