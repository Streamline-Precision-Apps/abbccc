import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";
import { Images } from "@/components/(reusable)/images";
import { AddWholeTimeSheet } from "@/actions/timeSheetActions"; // Import your server action
import { text } from "stream/consumers";

type AddTimeSheetProps = {
  jobsites: any[];
  employeeId: string;
  equipment: any[]; // Equipment prop
};

export default function AddTimesheetsForm({
  jobsites,
  employeeId,
  equipment,
}: AddTimeSheetProps) {
  const t = useTranslations("admin");

  // Initialize startTime and endTime with the current date and time
  const currentDate = new Date();
  const localDateTime = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(localDateTime);
  const [endTime, setEndTime] = useState<string | null>(localDateTime);
  const [selectedJobsiteQrId, setSelectedJobsiteQrId] = useState<string>(""); // Store qrId
  const [selectedJobsiteId, setSelectedJobsiteId] = useState<string>(""); // Store jobsite ID for filtering cost codes
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(""); // Store selected vehicle
  const [filteredCostCodes, setFilteredCostCodes] = useState<
    { id: string; name: string; description: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term for vehicle ID
  const [filteredEquipment, setFilteredEquipment] = useState<any[]>([]); // Filtered equipment
  const [focused, setFocused] = useState(false); // State to track input focus

  useEffect(() => {
    if (!startTime || !endTime) return;
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const calculatedDuration = (end - start) / (1000 * 60 * 60); // Calculate duration in hours
    if (calculatedDuration > 0) {
      setDuration(calculatedDuration);
    } else {
      setDuration(0); // Ensure no negative durations
    }
  }, [startTime, endTime]);

  useEffect(() => {
    // Filter cost codes based on selected jobsite
    const selectedJobsite = jobsites.find(
      (jobsite) => jobsite.id === selectedJobsiteId
    );
    setFilteredCostCodes(selectedJobsite ? selectedJobsite.costCode : []);
  }, [selectedJobsiteId, jobsites]);

  // Filter the equipment list based on the search term and equipmentTag 'TRUCK'
  useEffect(() => {
    setFilteredEquipment(
      equipment.filter(
        (equip) =>
          equip.equipmentTag === "TRUCK" &&
          (equip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equip.qrId.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, equipment]);

  const handleJobsiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedJobsite = jobsites.find(
      (jobsite) => jobsite.id === e.target.value
    );
    if (selectedJobsite) {
      setSelectedJobsiteId(selectedJobsite.id); // Use id to filter cost codes
      setSelectedJobsiteQrId(selectedJobsite.qrId); // Use qrId for form submission
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("duration", String(duration));
    formData.set("jobsiteId", selectedJobsiteQrId); // Append jobsite QR ID
    formData.delete("vehicleIdSearch");
    console.log(formData);
    try {
      await AddWholeTimeSheet(formData); // Call the server action with form data
    } catch (error) {
      console.error("Error creating timesheet:", error);
    }
  };

  return (
    <Forms onSubmit={handleSubmit}>
      <Inputs
        variant="default"
        id="submitDate"
        name="submitDate"
        type="hidden"
        value={localDateTime}
      />
      <Labels type="title">{t("Date")}</Labels>
      <Inputs variant="default" id="date" name="date" type="date" />

      <Labels type="title">{t("JobsiteID")}</Labels>
      <Selects
        id="jobsiteId"
        name="jobsiteId"
        onChange={handleJobsiteChange}
        value={selectedJobsiteId}
      >
        <Options value="">{t("Select Jobsite")}</Options>
        {jobsites.map((jobsite) => (
          <Options key={jobsite.id} value={jobsite.id}>
            {jobsite.name}
          </Options>
        ))}
      </Selects>

      <Labels type="title">{t("CostCode")}</Labels>
      <Selects id="costcode" name="costcode">
        <Options value="">{t("Select Cost Code")}</Options>
        {filteredCostCodes.map((costcode) => (
          <Options key={costcode.name} value={costcode.name}>
            {costcode.description} {/* Display costcode by description */}
          </Options>
        ))}
      </Selects>

      <Labels type="title">{t("StartTime")}</Labels>
      <Inputs
        variant="default"
        id="startTime"
        name="startTime"
        type="datetime-local"
        value={startTime || ""}
        onChange={(e) => setStartTime(e.target.value)} // Update startTime state
      />

      <Labels type="title">{t("EndTime")}</Labels>
      <Inputs
        variant="default"
        id="endTime"
        name="endTime"
        type="datetime-local"
        value={endTime || ""}
        onChange={(e) => setEndTime(e.target.value)} // Update endTime state
      />

      <Labels type="title">
        {t("Duration (Hours): ", { duration: duration.toFixed(2) })}
      </Labels>

      {/* Vehicle Search Section */}
      <Labels type="title">{t("Vehicle (by Name or QR ID)")}</Labels>

      <div className="relative w-full">
        {/* Input field with search icon */}
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <Images
            titleImg="/search.svg"
            titleImgAlt="search"
            className="w-6 h-6 ml-2"
          />
          <Inputs
            variant="default"
            id="vehicleIdSearch"
            name="vehicleIdSearch"
            type="text"
            placeholder={t("Search Vehicle by Name or QR ID")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 focus:outline-none"
            onFocus={() => setFocused(true)} // Show dropdown on focus
            onBlur={() => setTimeout(() => setFocused(false), 100)} // Hide dropdown on blur
          />
        </div>

        {/* Dropdown menu for filtered vehicles */}
        {focused && filteredEquipment.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto">
            {filteredEquipment.map((equip) => (
              <li
                key={equip.id}
                onClick={() => {
                  setSelectedVehicleId(equip.qrId); // Set selected vehicle ID
                  setSearchTerm(equip.name); // Update search term to show selected vehicle in the input
                  setFocused(false); // Close the dropdown
                }}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {equip.name} (QR ID: {equip.qrId})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Conditional rendering based on vehicle selection */}
      {selectedVehicleId && (
        <>
          <Labels type="title">{t("StartingMileage")}</Labels>
          <Inputs
            variant="default"
            id="startingMileage"
            name="startingMileage"
            type="number"
          />

          <Labels type="title">{t("Ending Mileage")}</Labels>
          <Inputs
            variant="default"
            id="endingMileage"
            name="endingMileage"
            type="number"
          />

          <Labels type="title">{t("Left Idaho")}</Labels>
          <Selects id="leftIdaho" name="leftIdaho">
            <Options value="">{t("Select")}</Options>
            <Options value="true">{t("True")}</Options>
            <Options value="false">{t("False")}</Options>
          </Selects>

          <Labels type="title">{t("Equipment Hauled")}</Labels>
          <Inputs
            variant="default"
            id="equipmentHauled"
            name="equipmentHauled"
            type="text"
          />

          <Labels type="title">{t("Materials Hauled")}</Labels>
          <Inputs
            variant="default"
            id="materialsHauled"
            name="materialsHauled"
            type="text"
          />

          <Labels type="title">{t("HauledLoadsQuantity")}</Labels>
          <Inputs
            variant="default"
            id="hauledLoadsQuantity"
            name="hauledLoadsQuantity"
            type="number"
          />

          <Labels type="title">{t("GallonsRefueled")}</Labels>
          <Inputs
            variant="default"
            id="refuelingGallons"
            name="refuelingGallons"
            type="number"
          />
        </>
      )}

      <Labels type="title">{t("Comments")}</Labels>
      <Inputs
        variant="default"
        type="text"
        id="timeSheetComments"
        name="timeSheetComments"
      />

      {/* Hidden userId field */}
      <Inputs type="hidden" id="userId" name="userId" value={employeeId} />

      <Buttons background={"green"} type="submit">
        {t("Submit")}
      </Buttons>
    </Forms>
  );
}
