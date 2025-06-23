"use client";
import { useNotification } from "@/app/context/NotificationContext";
import { NotificationComponent } from "@/components/(inputs)/NotificationComponent";
import { Buttons } from "@/components/(reusable)/buttons";
import { Forms } from "@/components/(reusable)/forms";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { TimesheetReport } from "./TimeSheetReport";

export default function CustomForms() {
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);
  const [page, setPage] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { setNotification } = useNotification();
  const t = useTranslations("Admins");
  // Centralized validation logic
  const validateForm = () => {
    if (page === "timesheets") {
      return startDate !== "" && endDate !== "";
    }
    // TODO: Add validation for other forms in the future
    return false;
  };

  // Dynamically update readyToSubmit based on validation
  useEffect(() => {
    setReadyToSubmit(validateForm());
  }, [page, startDate, endDate]);

  const handleFormSubmit = async (page: string, e: FormEvent) => {
    e.preventDefault();
    if (!readyToSubmit) {
      setNotification(
        t("PleaseCompleteAllRequiredFieldsBeforeSubmitting"),
        "neutral"
      );
      return;
    }

    // Perform submission logic here
    if (page === "timesheets") {
      // add query parameters to the URL
      const updatedSearchParams = new URLSearchParams(window.location.search);
      updatedSearchParams.set("page", page);
      updatedSearchParams.set("startDate", startDate);
      updatedSearchParams.set("endDate", endDate);
      const newUrl = `${
        window.location.pathname
      }?${updatedSearchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    }
  };
  const handleFormChange = () => {
    const updatedSearchParams = new URLSearchParams(window.location.search);

    // Clear all relevant parameters when the form changes
    updatedSearchParams.delete("page");
    updatedSearchParams.delete("startDate");
    updatedSearchParams.delete("endDate");

    // Update the URL without reloading
    const newUrl = `${
      window.location.pathname
    }?${updatedSearchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  // clears query parameters when the form changes and clear the other parameters
  const handleSelectedForm = (page: string) => {
    setPage(page);
    setStartDate("");
    setEndDate("");
    handleFormChange();
    handleFormChange();
  };

  return (
    <Holds className="w-full h-full ">
      <Grids rows={"10"} gap={"5"} className="w-full h-full">
        <Holds className="row-span-1 h-full w-full">
          <Selects
            defaultValue=""
            variant={"default"}
            onChange={(e) => {
              handleSelectedForm(e.target.value);
            }}
          >
            <Options value="">{t("SelectForm")}</Options>
            <Options value="timesheets">{t("FullTimesheets")}</Options>
            <Options value="viewpoint">{t("ViewTimesheetsExtract")}</Options>
          </Selects>
        </Holds>

        {page === "timesheets" && (
          <TimesheetReport
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </Grids>

      <Holds className="row-start-10 row-end-11 ">
        <Forms
          onSubmit={(e) => {
            handleFormSubmit(page, e);
          }}
        >
          {/* Include any hidden inputs if needed */}
          <Inputs type="hidden" name="startDate" value={startDate} />
          <Inputs type="hidden" name="endDate" value={endDate} />
          <Buttons
            background={readyToSubmit ? "green" : "darkGray"}
            type="submit"
            disabled={!readyToSubmit}
            className="py-3"
          >
            {t("ExtractReport")}
          </Buttons>
        </Forms>
      </Holds>
    </Holds>
  );
}
