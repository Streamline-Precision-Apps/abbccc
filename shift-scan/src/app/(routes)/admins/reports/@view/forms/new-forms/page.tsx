"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import Form from "@/app/hamburger/inbox/form/content";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

export default function NewForms() {
  return (
    <ReusableViewLayout
      gap={"0"}
      custom={true}
      header={
        <Holds
          position={"row"}
          background={"white"}
          className="w-full h-full col-span-2 px-4 gap-3 rounded-br-none border-b-[3px] border-black "
        >
          <Holds className="h-full w-[30%] justify-center">
            <Inputs
              type="text"
              placeholder="New Form Name"
              className="py-3 pl-2 placeholder:text-app-dark-gray"
            />
          </Holds>
          <Holds className="h-full w-[20%] justify-center">
            <Selects className=" py-3.5 text-center text-app-dark-gray">
              <option value="">Form Type</option>
            </Selects>
          </Holds>
          <Holds className="h-full w-[50%] justify-center">
            {/* Todo: Add Active Form slider*/}
          </Holds>
        </Holds>
      }
      mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue pl-4 rounded-none"
      main={<MainForms />}
      footer={
        <Holds
          background={"white"}
          position={"row"}
          className="w-full col-span-2 px-4 gap-3 rounded-tr-none "
        >
          <Holds className=" w-[20%] justify-center">
            <Buttons background={"orange"} className=" py-2 text-center ">
              <Titles size={"h4"}>Preview</Titles>
            </Buttons>
          </Holds>
          <Holds className="  justify-center">
            <Buttons
              background={"green"}
              position={"right"}
              className=" py-2 text-center w-[30%] min-w-[150px]"
            >
              <Titles size={"h4"}>Create Form</Titles>
            </Buttons>
          </Holds>
        </Holds>
      }
    />
  );
}

function MainForms() {
  return (
    <Holds className="w-full h-full justify-center items-center rounded-none">
      <Grids cols={"5"} className="h-full w-full">
        <Holds className="col-start-1 col-end-5 h-full w-full justify-center p-2">
          <Holds
            background={"lightGray"}
            className="h-full w-full opacity-5"
          ></Holds>
        </Holds>
        <Holds
          background={"white"}
          className="col-start-5 col-end-6 h-full w-full justify-center rounded-none border-l-[3px] border-b-[3px] border-black"
        >
          <SidePanel />
        </Holds>
      </Grids>
    </Holds>
  );
}

const SidePanel = () => {
  return (
    <Holds className="w-full h-full justify-center items-center ">
      <Holds className="h-full w-full p-3">
        <Texts size={"p6"} className="pb-3">
          Layout Fields
        </Texts>
        <Grids cols={"2"} rows={"3"} gap={"5"} className="h-full w-full">
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Title</Titles>
          </Buttons>
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Sub-Title</Titles>
          </Buttons>
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Paragraph</Titles>
          </Buttons>
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Spacer</Titles>
          </Buttons>
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Separator</Titles>
          </Buttons>
        </Grids>
      </Holds>
      <Holds className="h-full w-full p-3">
        <Texts size={"p6"} className="pb-3">
          Form Fields
        </Texts>
        <Grids cols={"2"} rows={"3"} gap={"5"} className="h-full w-full ">
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Number</Titles>
          </Buttons>

          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Number</Titles>
          </Buttons>
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Text Area</Titles>
          </Buttons>
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Date</Titles>
          </Buttons>
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Dropdown</Titles>
          </Buttons>
          <Buttons className="row-span-1 col-span-1">
            <Titles size={"h6"}>Checkbox</Titles>
          </Buttons>
        </Grids>
      </Holds>
    </Holds>
  );
};
