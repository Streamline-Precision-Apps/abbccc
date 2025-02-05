import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Titles } from "@/components/(reusable)/titles";
import { Clock } from "@/components/clock";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const LaborClockOut = ({
  handleButtonClick,
  scanResult,
  savedCostCode,
  formRef,
  isSubmitting,
}: {
  handleButtonClick: () => void;
  scanResult: string | null;
  savedCostCode: string | null;
  formRef: React.RefObject<HTMLFormElement>;
  isSubmitting: boolean;
}) => {
  const t = useTranslations("ClockOut");
  const [date] = useState(new Date());
  return (
    <Holds background={"white"} className="h-full w-full">
      <Grids rows={"7"} gap={"5"}>
        <Holds className="h-full w-full row-start-1 row-end-2 p-3">
          <Grids rows={"2"} cols={"5"} gap={"3"} className=" h-full w-full">
            <Holds
              className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
              onClick={() => {}}
            >
              <Images
                titleImg="/turnBack.svg"
                titleImgAlt="back"
                position={"left"}
              />
            </Holds>
            <Holds className="row-start-2 row-end-3 col-span-5 h-full w-full justify-center">
              <Grids
                cols={"5"}
                rows={"1"}
                gap={"5"}
                className="h-full w-full relative"
              >
                <Holds className="col-start-1 col-end-4 h-full w-full justify-center">
                  <Titles size={"h1"} position={"right"}>
                    {t("ClockOut")}
                  </Titles>
                </Holds>
                <Holds className="col-start-4 col-end-5 h-full w-full justify-center absolute">
                  <Images
                    titleImg="/clock-out.svg"
                    titleImgAlt="Verify"
                    size={"full"}
                  />
                </Holds>
              </Grids>
            </Holds>
          </Grids>
        </Holds>
        <Holds className="row-start-2 row-end-8 ">
          <Grids rows={"10"} cols={"5"} className="h-full w-full">
            <Holds className="row-start-2 row-end-8 col-start-1 col-end-6 h-full pt-1">
              <Holds
                background={"lightBlue"}
                className="h-full w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]  border-[3px] rounded-b-none  border-black "
              >
                <Contents width={"section"} className="h-full">
                  <Labels
                    htmlFor="date"
                    text={"white"}
                    size={"p4"}
                    position={"left"}
                  >
                    {t("Date-label")}
                  </Labels>
                  <Inputs
                    name="date"
                    state="disabled"
                    variant={"white"}
                    data={date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  />
                  <Labels
                    htmlFor="jobsiteId"
                    text={"white"}
                    size={"p4"}
                    position={"left"}
                  >
                    {t("JobSite-label")}
                  </Labels>
                  <Inputs
                    state="disabled"
                    name="jobsiteId"
                    variant={"white"}
                    data={scanResult || ""}
                  />
                  <Labels
                    htmlFor="costcode"
                    text={"white"}
                    size={"p4"}
                    position={"left"}
                  >
                    {t("CostCode-label")}
                  </Labels>
                  <Inputs
                    state="disabled"
                    name="costcode"
                    variant={"white"}
                    data={savedCostCode?.toString() || ""}
                  />
                </Contents>
              </Holds>
            </Holds>

            <Holds className="row-start-8 row-end-11 col-start-1 col-end-6">
              <Holds
                background={"darkBlue"}
                className="h-full w-[100%] sm:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[80%]  border-[3px]   border-black p-8 "
              >
                <form ref={formRef} className="w-full h-full">
                  <Inputs
                    type="hidden"
                    name="endTime"
                    value={new Date().toISOString()}
                    readOnly
                  />
                  <Inputs
                    type="hidden"
                    name="timeSheetComments"
                    value={""}
                    readOnly
                  />
                  <Buttons
                    onClick={handleButtonClick}
                    className="bg-app-red flex justify-center w-full h-full p-4 rounded-[10px] text-black font-bold"
                    disabled={isSubmitting}
                  >
                    <Clock time={date.getTime()} />
                  </Buttons>
                </form>
              </Holds>
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
};
