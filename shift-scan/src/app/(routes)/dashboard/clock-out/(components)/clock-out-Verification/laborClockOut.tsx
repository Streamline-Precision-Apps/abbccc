import {
  RemoveCookiesAtClockOut,
  setStartingMileage,
} from "@/actions/cookieActions";
import { updateTimeSheet } from "@/actions/timeSheetActions";
import { Bases } from "@/components/(reusable)/bases";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LaborClockOut = ({
  scanResult,
  savedCostCode,
  prevStep,
}: {
  scanResult: string | undefined;
  savedCostCode: string | null;
  prevStep: () => void;
}) => {
  const t = useTranslations("ClockOut");
  const [date] = useState(new Date());
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents default form submission

    try {
      let timeSheetId = null;
      const response = await fetch("/api/getRecentTimecard");
      const tsId = await response.json();
      timeSheetId = tsId.id;

      if (!timeSheetId) {
        alert("No valid TimeSheet ID was found. Please try again later.");
        return;
      }

      // Collect form data
      const formData = new FormData(event.currentTarget);
      formData.append("id", timeSheetId); // Ensure TimeSheet ID is included

      await updateTimeSheet(formData);
      localStorage.clear();
      setStartingMileage("");
      RemoveCookiesAtClockOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to submit the time sheet:", error);
    }
  };

  return (
    <Bases>
      <Contents>
        <Holds background={"white"} className="h-full w-full">
          <Grids rows={"8"} gap={"5"} className="h-full w-full">
            <Holds className="h-full w-full row-start-1 row-end-2 p-3">
              <Grids rows={"2"} cols={"5"} gap={"3"} className=" h-full w-full">
                <Holds className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center">
                  <Images
                    titleImg="/turnBack.svg"
                    titleImgAlt="back"
                    position={"left"}
                    onClick={prevStep}
                  />
                </Holds>

                <Holds
                  position={"row"}
                  className="row-start-2 row-end-3 col-start-1 col-end-6 "
                >
                  <Holds size={"50"}>
                    <Titles size={"h1"} position={"right"}>
                      {t("ClockOut")}
                    </Titles>
                  </Holds>

                  <Holds size={"50"}>
                    <Images
                      titleImg="/clock-out.svg"
                      titleImgAlt="Verify"
                      size={"50"}
                    />
                  </Holds>
                </Holds>
              </Grids>
            </Holds>

            {/* form Grid */}
            <Holds className="row-start-2 row-end-9 h-full w-full ">
              <Grids rows={"10"} cols={"5"}>
                <Holds className="row-start-2 row-end-7 col-start-1 col-end-6 h-full pt-1">
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

                <Holds className="row-start-7 row-end-11 col-start-1 col-end-6 h-full">
                  <Holds
                    background={"darkBlue"}
                    className="h-full w-[100%] sm:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[80%]  border-[3px]   border-black p-8 "
                  >
                    <form onClick={handleSubmit} className="h-full">
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
                      {/* Cancel out the button shadow with none background  and then add a class name */}
                      <Buttons
                        type="submit"
                        className="bg-app-green flex justify-center items-center p-4 rounded-[10px] text-black font-bold"
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
      </Contents>
    </Bases>
  );
};
