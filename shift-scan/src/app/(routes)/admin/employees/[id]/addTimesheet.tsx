import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";
import { CreateTimeSheet } from "@/actions/timeSheetActions"; // Import your server action

type AddTimeSheetProps = {
  jobsites: any[];
  costcodes: any[];
  employeeId: string;
};

const AddTimesheetsForm = ({jobsites, costcodes, employeeId} : AddTimeSheetProps ) => {
  const t = useTranslations("admin");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!startTime || !endTime) return;
    setDuration(((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)));
  }, [startTime, endTime]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await CreateTimeSheet(formData); // Call the server action with form data
    } catch (error) {
      console.error("Error creating timesheet:", error);
    }
  };

  return (
    <Forms onSubmit={handleSubmit}>
      <Labels size="default" type="title">
        {t("Submit Date")}
      </Labels>
      <Inputs variant="default" id="submitDate" name="submitDate" value={String(new Date())} type="hidden" />

      <Labels size="default" type="title">
        {t("Date")}
      </Labels>
      <Inputs variant="default" id="date" name="date" type="date" />

      <Labels size="default" type="title">
        {t("Jobsite ID")}
      </Labels>
      {/* Populate this with jobsites pulled from the database. It will be be a search bar.*/}
      <Inputs variant="default" id="jobsiteId" name="jobsiteId" type="text" />

      <Labels size="default" type="title">
        {t("Cost Code")}
      </Labels>
      {/* Populate this with cost codes pulled from the database. It will be be a search bar. The values available will be decided by the selected jobsites */}
      <Inputs variant="default" id="costcode" name="costcode" type="text" />

      <Labels size="default" type="title">
        {t("Vehicle ID")}
      </Labels>
      {/* Populate this with vehicles pulled from the database. It will be be a search bar.*/}
      <Inputs variant="default" id="vehicleId" name="vehicleId" type="number" />

      <Labels size="default" type="title">
        {t("Start Time")}
      </Labels>
      <Inputs variant="default" id="startTime" name="startTime" type="datetime-local" />

      <Labels size="default" type="title">
        {t("End Time")}
      </Labels>
      <Inputs variant="default" id="endTime" name="endTime" type="datetime-local" />

      <Labels size="default" type="title">
        {t("Duration (Hours)")}
      </Labels>
      <Inputs variant="default" id="duration" name="duration" type="number" value={duration} readOnly={true}/>

      <Labels size="default" type="title">
        {t("Starting Mileage")}
      </Labels>
      <Inputs variant="default" id="startingMileage" name="startingMileage" type="number" />

      <Labels size="default" type="title">
        {t("Ending Mileage")}
      </Labels>
      <Inputs variant="default" id="endingMileage" name="endingMileage" type="number" />

      <Labels size="default" type="title">
        {t("Left Idaho")}
      </Labels>
      <Selects id="leftIdaho" name="leftIdaho">
        <Options value="">{t("Select")}</Options>
        <Options value="true">{t("True")}</Options>
        <Options value="false">{t("False")}</Options>
      </Selects>

      <Labels size="default" type="title">
        {t("Equipment Hauled")}
      </Labels>
      <Inputs variant="default" id="equipmentHauled" name="equipmentHauled" type="text" />

      <Labels size="default" type="title">
        {t("Materials Hauled")}
      </Labels>
      <Inputs variant="default" id="materialsHauled" name="materialsHauled" type="text" />

      <Labels size="default" type="title">
        {t("Hauled Loads Quantity")}
      </Labels>
      <Inputs variant="default" id="hauledLoadsQuantity" name="hauledLoadsQuantity" type="number" />

      <Labels size="default" type="title">
        {t("Refueling Gallons")}
      </Labels>
      <Inputs variant="default" id="refuelingGallons" name="refuelingGallons" type="number" />

      <Labels size="default" type="title">
        {t("Timesheet Comments")}
      </Labels>
      <TextAreas id="timesheetComments" name="timesheetComments" />

      <Labels size="default" type="title">
        {t("User ID")}
      </Labels>
      <Inputs variant="default" id="userId" name="userId" type="text" />

      <Buttons variant="green" type="submit">
        {t("Submit")}
      </Buttons>
    </Forms>
  );
};

export default AddTimesheetsForm;
