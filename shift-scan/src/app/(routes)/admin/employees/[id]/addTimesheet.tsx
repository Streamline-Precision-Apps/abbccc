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

export default function AddTimesheetsForm({jobsites, costcodes, employeeId} : AddTimeSheetProps ) {
  const t = useTranslations("admin");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [selectedJobsiteId, setSelectedJobsiteId] = useState<string>("");
  const [filteredCostCodes, setFilteredCostCodes] = useState<{ id: string; name: string }[]>([]);


  useEffect(() => {
    if (!startTime || !endTime) return;
    setDuration(((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)));
  }, [startTime, endTime]);

  useEffect(() => {
    // Filter cost codes based on selected jobsite
    const selectedJobsite = jobsites.find(jobsite => jobsite.id === selectedJobsiteId);
    setFilteredCostCodes(selectedJobsite ? selectedJobsite.costCode : []);
  }, [selectedJobsiteId, jobsites]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('duration', String(duration));
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
        {t("JobsiteID")}
      </Labels>
      <Selects id="jobsiteId" name="jobsiteId" onChange={(e) => setSelectedJobsiteId(e.target.value)} value={selectedJobsiteId}>
        <Options value="">{t("Select Jobsite")}</Options>
        {jobsites.map(jobsite => (
          <Options key={jobsite.id} value={jobsite.id}>
            {jobsite.name}
          </Options>
        ))}
      </Selects>

      <Labels size="default" type="title">
        {t("CostCode")}
      </Labels>
      <Selects id="costcode" name="costcode">
        <Options value="">{t("Select Cost Code")}</Options>
        {filteredCostCodes.map(costcode => (
          <Options key={costcode.id} value={costcode.id}>
            {costcode.name}
          </Options>
        ))}
      </Selects>

      <Labels size="default" type="title">
        {t("VehicleId")}
      </Labels>
      {/* Populate this with vehicles pulled from the database. It will be be a search bar.*/}
      <Inputs variant="default" id="vehicleId" name="vehicleId" type="number" />

      <Labels size="default" type="title">
        {t("StartTime")}
      </Labels>
      <Inputs variant="default" id="startTime" name="startTime" type="datetime-local" />

      <Labels size="default" type="title">
        {t("EndTime")}
      </Labels>
      <Inputs variant="default" id="endTime" name="endTime" type="datetime-local" />

      <Labels size="default" type="title">
        {t("StartingMileage")}
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
        {t("HauledLoadsQuantity")}
      </Labels>
      <Inputs variant="default" id="hauledLoadsQuantity" name="hauledLoadsQuantity" type="number" />

      <Labels size="default" type="title">
        {t("GallonsRefueled")}
      </Labels>
      <Inputs variant="default" id="refuelingGallons" name="refuelingGallons" type="number" />

      <Labels size="default" type="title">
        {t("Comments")}
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
