"use client";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { timecardData } from "@/actions/adminActions";
import { Texts } from "@/components/(reusable)/texts";
import { z } from "zod";

// Zod schema for timesheet data
const TimesheetSchema = z.object({
  submitDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  id: z.string(),
  userId: z.string(),
  date: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  jobsiteId: z.string(),
  costcode: z.string(),
  nu: z.string(),
  Fp: z.string(),
  vehicleId: z.string(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  startingMileage: z.number().nullable().optional(),
  endingMileage: z.number().nullable().optional(),
  leftIdaho: z.boolean().optional(),
  equipmentHauled: z.string().optional(),
  materialsHauled: z.string().optional(),
  hauledLoadsQuantity: z.number().nullable().optional(),
  refuelingGallons: z.number().nullable().optional(),
  timeSheetComments: z.string().optional(),
  status: z.string(),
});

// Zod schema for timesheet array
const TimesheetsArraySchema = z.array(TimesheetSchema);

type TimeSheets = z.infer<typeof TimesheetsArraySchema>[number];

export default function Reports() {
  const [timeSheets, setTimeSheets] = useState<TimeSheets[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPayroll, setShowPayroll] = useState(true);

  // on reload page, set showPayroll to true
  useEffect(() => {
    setShowPayroll(true);
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true); // Start loading
    setShowPayroll(false);
    const data = await timecardData(formData);
    const formattedData = data.map((sheet) => ({
      ...sheet,
      id: sheet.id.toString(), // Convert id to string
      submitDate: sheet.submitDate.toLocaleDateString(),
      date: sheet.date.toLocaleDateString(),
      vehicleId: sheet.vehicleId?.toString() || "",
      startTime: sheet.startTime.toLocaleTimeString(),
      endTime: sheet.endTime?.toLocaleTimeString() || "",
      duration: sheet.duration === null ? null : Number(sheet.duration),
      startingMileage: sheet.startingMileage || null,
      endingMileage: Number(sheet.endingMileage) || null,
      leftIdaho:
        sheet.leftIdaho === true
          ? true
          : sheet.leftIdaho === false
          ? false
          : undefined,
      equipmentHauled: sheet.equipmentHauled || "",
      materialsHauled: sheet.materialsHauled || "",
      hauledLoadsQuantity: sheet.hauledLoadsQuantity || null,
      refuelingGallons: sheet.refuelingGallons || null,
      timeSheetComments: sheet.timeSheetComments || "",
    }));

    setTimeSheets(formattedData);
    setInterval(() => {
      setLoading(false); // End loading
    }, 4000);
  };

  // Define the headers for the CSV
  const headers = [
    { label: "Submit Date", key: "submitDate" },
    { label: "Date", key: "date" },
    { label: "Cost Code", key: "costcode" },
    { label: "Vehicle ID", key: "vehicleId" },
    { label: "Start Time", key: "startTime" },
    { label: "End Time", key: "endTime" },
    { label: "Duration", key: "duration" },
    { label: "Starting Mileage", key: "startingMileage" },
    { label: "Ending Mileage", key: "endingMileage" },
    { label: "Left Idaho", key: "leftIdaho" },
    { label: "Equipment Hauled", key: "equipmentHauled" },
    { label: "Materials Hauled", key: "materialsHauled" },
    { label: "Hauled Loads Quantity", key: "hauledLoadsQuantity" },
    { label: "Refueling Gallons", key: "refuelingGallons" },
    { label: "Timesheet Comments", key: "timeSheetComments" },
    { label: "User ID", key: "userId" },
    { label: "Jobsite ID", key: "jobsiteId" },
  ];

  // Convert the timesheets to a format that the CSVLink can use
  const csvData = timeSheets.map((sheet) => ({
    submitDate: new Date(sheet.submitDate).toLocaleDateString(),
    date: new Date(sheet.date).toLocaleDateString(),
    costcode: sheet.costcode,
    vehicleId: sheet.vehicleId,
    startTime: sheet.startTime
      ? new Date(sheet.startTime).toLocaleTimeString()
      : "",
    endTime: sheet.endTime ? new Date(sheet.endTime).toLocaleTimeString() : "",
    duration: sheet.duration,
    startingMileage: sheet.startingMileage,
    endingMileage: sheet.endingMileage,
    leftIdaho: sheet.leftIdaho ? "Yes" : "No",
    equipmentHauled: sheet.equipmentHauled,
    materialsHauled: sheet.materialsHauled,
    hauledLoadsQuantity: sheet.hauledLoadsQuantity,
    refuelingGallons: sheet.refuelingGallons,
    timeSheetComments: sheet.timeSheetComments,
    userId: sheet.userId,
    jobsiteId: sheet.jobsiteId,
  }));

  return (
    <Bases>
      <Holds>
        <TitleBoxes
          title={"Reports"}
          titleImg="/forms.svg"
          titleImgAlt="Reports"
          variant={"default"}
        />
      </Holds>
      <Holds>
        <Forms action={handleSubmit}>
          <Labels type="title">Select Report</Labels>
          <Inputs type="default" state="disabled" data="Payroll" />
        </Forms>
      </Holds>
      <Holds>
        <Forms action={handleSubmit}>
          <Labels type="title">Start Date</Labels>
          <Inputs
            type="date"
            name="start"
            onChange={() => setShowPayroll(true)}
          />
          <Labels type="title">End Date</Labels>
          <Inputs
            type="date"
            name="end"
            onChange={() => setShowPayroll(true)}
          />
          {showPayroll && (
            <Buttons background={"green"}>
              <Texts>View Payroll Report</Texts>
            </Buttons>
          )}
        </Forms>
      </Holds>
      <Holds>
        {loading ? (
          <Texts>Loading...</Texts> // Display a loading indicator
        ) : timeSheets.length > 0 ? (
          <>
            <Buttons background={"green"}>
              <CSVLink
                data={csvData}
                headers={headers}
                filename={"timeSheets.csv"}
                className="btn btn-primary"
                target="_blank"
              >
                <Texts>Download as CSV</Texts>
              </CSVLink>
            </Buttons>
            <table>
              <thead>
                <tr>
                  <th>Submit Date</th>
                  <th>Date</th>
                  <th>Cost Code</th>
                  <th>Vehicle ID</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration</th>
                  <th>StartMileage</th>
                  <th>EndMileage</th>
                  <th>Left Idaho</th>
                  <th>EquipHauled</th>
                  <th>Materials Hauled</th>
                  <th>LoadQty</th>
                  <th>FuelGallons</th>
                  <th>Comments</th>
                  <th>User ID</th>
                  <th>Jobsite ID</th>
                </tr>
              </thead>
              <tbody>
                {timeSheets.map((sheet, index) => (
                  <tr key={index}>
                    <td>{new Date(sheet.submitDate).toLocaleDateString()}</td>
                    <td>{new Date(sheet.date).toLocaleDateString()}</td>
                    <td>{sheet.costcode}</td>
                    <td>{sheet.vehicleId}</td>
                    <td>
                      {sheet.startTime
                        ? new Date(sheet.startTime).toLocaleTimeString()
                        : ""}
                    </td>
                    <td>
                      {sheet.endTime
                        ? new Date(sheet.endTime).toLocaleTimeString()
                        : ""}
                    </td>
                    <td>{sheet.duration}</td>
                    <td>{sheet.startingMileage}</td>
                    <td>{sheet.endingMileage}</td>
                    <td>{sheet.leftIdaho ? "Yes" : "No"}</td>
                    <td>{sheet.equipmentHauled}</td>
                    <td>{sheet.materialsHauled}</td>
                    <td>{sheet.hauledLoadsQuantity}</td>
                    <td>{sheet.refuelingGallons}</td>
                    <td>{sheet.timeSheetComments}</td>
                    <td>{sheet.userId}</td>
                    <td>{sheet.jobsiteId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <Texts>No data available for the selected date range.</Texts>
        )}
      </Holds>
    </Bases>
  );
}
