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

export default function Reports() {
    const [timeSheets, setTimeSheets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);  // Add loading state
    const [showPayroll, setShowPayroll] = useState(true);

    // on reload page, set showPayroll to true
    useEffect(() => {
        setShowPayroll(true);
    }, []);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);  // Start loading
        setShowPayroll(false)
        const data = await timecardData(formData);
        setTimeSheets(data);
        setInterval(() => {
        setLoading(false);  // End loading
        } , 4000);
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
        { label: "Jobsite ID", key: "jobsiteId" }
    ];

    // Convert the timesheets to a format that the CSVLink can use
    const csvData = timeSheets.map(sheet => ({
        submitDate: new Date(sheet.submitDate).toLocaleDateString(),
        date: new Date(sheet.date).toLocaleDateString(),
        costcode: sheet.costcode,
        vehicleId: sheet.vehicleId,
        startTime: sheet.startTime ? new Date(sheet.startTime).toLocaleTimeString() : '',
        endTime: sheet.endTime ? new Date(sheet.endTime).toLocaleTimeString() : '',
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
        jobsiteId: sheet.jobsiteId
    }));

    return (
        <Bases>
            <Holds size={"titleBox"}>
                <TitleBoxes
                    title={"Reports"}
                    titleImg="/forms.svg"
                    titleImgAlt="Reports"
                    variant={"default"}
                    size={"default"}
                />
            </Holds>
            <Holds size={"titleBox"}>
                <Forms action={handleSubmit}>
                    <Labels variant="default" type="title">Select Report</Labels>
                <Inputs variant="default" type="default" state="disabled" data="Payroll" />
                </Forms>
            </Holds>
            <Holds size={"titleBox"}>
                <Forms action={handleSubmit}>
                    <Labels variant="default" type="title" >Start Date</Labels>
                    <Inputs variant="default" type="date" name="start" onChange={() => setShowPayroll(true)} />
                    <Labels variant="default" type="title">End Date</Labels>
                    <Inputs variant="default" type="date" name="end" onChange={() => setShowPayroll(true)} />
                    {showPayroll && <Buttons variant={"green"} size={"default"}><Texts variant="default">View Payroll Report</Texts></Buttons>}
                </Forms>
                </Holds>
            <Holds size={"dynamic"}>
                {loading ? (
                    <Texts>Loading...</Texts>  // Display a loading indicator
                ) : timeSheets.length > 0 ? (
                    <>
                    <Buttons variant={"green"} size={"default"}>
                    <CSVLink
                            data={csvData}
                            headers={headers}
                            filename={"timeSheets.csv"}
                            className="btn btn-primary"
                            target="_blank"
                            >
                            <Texts variant="default">Download as CSV</Texts>
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
                                    <th>App Comment</th>
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
                                        <td>{sheet.startTime ? new Date(sheet.startTime).toLocaleTimeString() : ''}</td>
                                        <td>{sheet.endTime ? new Date(sheet.endTime).toLocaleTimeString() : ''}</td>
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
                    <Texts variant="default">No data available for the selected date range.</Texts>
                )}
                </Holds>
        </Bases>
    );
}