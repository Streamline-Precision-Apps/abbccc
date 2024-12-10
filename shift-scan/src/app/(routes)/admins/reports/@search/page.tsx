"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Forms } from "@/components/(reusable)/forms";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportSearch() {
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);
  const [page, setPage] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const searchParams = useSearchParams();
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

  const handleFormSubmit = async (page: string, e: any) => {
    e.preventDefault();
    if (!readyToSubmit) {
      alert("Please complete all required fields before submitting.");
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
    <Holds background={"white"} className="w-full h-full p-4">
      <Grids rows={"10"} gap={"5"} className="w-full h-full">
        <Holds className="row-start-1 row-end-10 h-full w-full">
          <Grids rows={"10"} gap={"5"} className="w-full h-full">
            <Holds className="row-span-1 h-full w-full">
              <Selects
                defaultValue=""
                variant={"default"}
                onChange={(e) => {
                  handleSelectedForm(e.target.value);
                }}
              >
                <Options value="">Select a form</Options>
                <Options value="timesheets">Full Timesheets</Options>
                <Options value="viewpoint">
                  Viewpoint Timesheets Extract
                </Options>
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
        </Holds>
        <Holds className="row-start-10 row-end-11 h-full w-full">
          <Forms
            onSubmit={(e) => {
              handleFormSubmit(page, e);
            }}
          >
            {/* Include any hidden inputs if needed */}
            <Inputs type="hidden" name="startDate" value={startDate} />
            <Inputs type="hidden" name="endDate" value={endDate} />
            <Buttons
              background={readyToSubmit ? "green" : "grey"}
              type="submit"
              disabled={!readyToSubmit}
            >
              Extract Report
            </Buttons>
          </Forms>
        </Holds>
      </Grids>
    </Holds>
  );
}

function TimesheetReport({
  setStartDate,
  setEndDate,
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
}) {
  const checkEndDate = (endDate: string) => {
    if (new Date(endDate) < new Date(startDate)) {
      alert("End date must be after start date");
      setEndDate(""); // Clear the invalid end date
    } else {
      setEndDate(endDate);
    }
  };

  const checkStartDate = (newStartDate: string) => {
    const start = new Date(newStartDate);
    const end = new Date(startDate);

    if (start > end) {
      alert("Start date cannot be after end date");
      setEndDate(""); // Clear the end date if it becomes invalid
    }
    setStartDate(newStartDate);
  };

  return (
    <Holds
      background={"white"}
      className="row-start-2 row-end-11 h-full w-full"
    >
      <Holds position={"row"} className="w-full h-full gap-5">
        <Holds className="row-start-1 row-end-3 col-span-1 h-full w-full">
          <Labels position={"left"} size={"p6"}>
            Start Date
          </Labels>
          <Inputs
            variant={"default"}
            type={"date"}
            value={startDate}
            onChange={(e) => checkStartDate(e.target.value)}
          />
        </Holds>
        <Holds className="row-start-1 row-end-3 col-span-1 h-full w-full">
          <Labels position={"left"} size={"p6"}>
            End Date
          </Labels>
          <Inputs
            variant={"default"}
            type={"date"}
            value={endDate}
            onChange={(e) => checkEndDate(e.target.value)}
          />
        </Holds>
      </Holds>
    </Holds>
  );
}