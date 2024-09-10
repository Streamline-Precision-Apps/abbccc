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

const AddTimesheetsForm = () => {
  const t = useTranslations("admin");
  const [duration, setDuration] = useState(0);
  const [start_time, setStartTime] = useState<Date | null>(null);
  const [end_time, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!start_time || !end_time) return;
    setDuration(((end_time.getTime() - start_time.getTime()) / (1000 * 60 * 60)));
  }, [start_time, end_time]);

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
      <Inputs variant="default" id="submit_date" name="submit_date" value={String(new Date())} type="hidden" />

      <Labels size="default" type="title">
        {t("Date")}
      </Labels>
      <Inputs variant="default" id="date" name="date" type="date" />

      <Labels size="default" type="title">
        {t("Jobsite ID")}
      </Labels>
      {/* Populate this with jobsites pulled from the database. It will be be a search bar.*/}
      <Inputs variant="default" id="jobsite_id" name="jobsite_id" type="text" />

      <Labels size="default" type="title">
        {t("Cost Code")}
      </Labels>
      {/* Populate this with cost codes pulled from the database. It will be be a search bar. The values available will be decided by the selected jobsites */}
      <Inputs variant="default" id="costcode" name="costcode" type="text" />

      <Labels size="default" type="title">
        {t("Vehicle ID")}
      </Labels>
      {/* Populate this with vehicles pulled from the database. It will be be a search bar.*/}
      <Inputs variant="default" id="vehicle_id" name="vehicle_id" type="number" />

      <Labels size="default" type="title">
        {t("Start Time")}
      </Labels>
      <Inputs variant="default" id="start_time" name="start_time" type="datetime-local" />

      <Labels size="default" type="title">
        {t("End Time")}
      </Labels>
      <Inputs variant="default" id="end_time" name="end_time" type="datetime-local" />

      <Labels size="default" type="title">
        {t("Duration (Hours)")}
      </Labels>
      <Inputs variant="default" id="duration" name="duration" type="number" value={duration} readOnly={true}/>

      <Labels size="default" type="title">
        {t("Starting Mileage")}
      </Labels>
      <Inputs variant="default" id="starting_mileage" name="starting_mileage" type="number" />

      <Labels size="default" type="title">
        {t("Ending Mileage")}
      </Labels>
      <Inputs variant="default" id="ending_mileage" name="ending_mileage" type="number" />

      <Labels size="default" type="title">
        {t("Left Idaho")}
      </Labels>
      <Selects id="left_idaho" name="left_idaho">
        <Options value="">{t("Select")}</Options>
        <Options value="true">{t("True")}</Options>
        <Options value="false">{t("False")}</Options>
      </Selects>

      <Labels size="default" type="title">
        {t("Equipment Hauled")}
      </Labels>
      <Inputs variant="default" id="equipment_hauled" name="equipment_hauled" type="text" />

      <Labels size="default" type="title">
        {t("Materials Hauled")}
      </Labels>
      <Inputs variant="default" id="materials_hauled" name="materials_hauled" type="text" />

      <Labels size="default" type="title">
        {t("Hauled Loads Quantity")}
      </Labels>
      <Inputs variant="default" id="hauled_loads_quantity" name="hauled_loads_quantity" type="number" />

      <Labels size="default" type="title">
        {t("Refueling Gallons")}
      </Labels>
      <Inputs variant="default" id="refueling_gallons" name="refueling_gallons" type="number" />

      <Labels size="default" type="title">
        {t("Timesheet Comments")}
      </Labels>
      <TextAreas id="timesheet_comments" name="timesheet_comments" />

      <Labels size="default" type="title">
        {t("App Comment")}
      </Labels>
      <TextAreas id="app_comment" name="app_comment" />

      <Labels size="default" type="title">
        {t("User ID")}
      </Labels>
      <Inputs variant="default" id="user_id" name="user_id" type="text" />

      <Buttons variant="green" size="default" type="submit">
        {t("Submit")}
      </Buttons>
    </Forms>
  );
};

export default AddTimesheetsForm;
