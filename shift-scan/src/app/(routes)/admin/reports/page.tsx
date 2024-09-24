"use client";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/Holds";
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
        { label: "Submit Date", key: "submit_date" },
        { label: "Date", key: "date" },
        { label: "Cost Code", key: "costcode" },
        { label: "Vehicle ID", key: "vehicle_id" },
        { label: "Start Time", key: "start_time" },
        { label: "End Time", key: "end_time" },
        { label: "Duration", key: "duration" },
        { label: "Starting Mileage", key: "starting_mileage" },
        { label: "Ending Mileage", key: "ending_mileage" },
        { label: "Left Idaho", key: "left_idaho" },
        { label: "Equipment Hauled", key: "equipment_hauled" },
        { label: "Materials Hauled", key: "materials_hauled" },
        { label: "Hauled Loads Quantity", key: "hauled_loads_quantity" },
        { label: "Refueling Gallons", key: "refueling_gallons" },
        { label: "Timesheet Comments", key: "timesheet_comments" },
        { label: "App Comment", key: "app_comment" },
        { label: "User ID", key: "userId" },
        { label: "Jobsite ID", key: "jobsite_id" }
    ];

    // Convert the timesheets to a format that the CSVLink can use
    const csvData = timeSheets.map(sheet => ({
        submit_date: new Date(sheet.submit_date).toLocaleDateString(),
        date: new Date(sheet.date).toLocaleDateString(),
        costcode: sheet.costcode,
        vehicle_id: sheet.vehicle_id,
        start_time: sheet.start_time ? new Date(sheet.start_time).toLocaleTimeString() : '',
        end_time: sheet.end_time ? new Date(sheet.end_time).toLocaleTimeString() : '',
        duration: sheet.duration,
        starting_mileage: sheet.starting_mileage,
        ending_mileage: sheet.ending_mileage,
        left_idaho: sheet.left_idaho ? "Yes" : "No",
        equipment_hauled: sheet.equipment_hauled,
        materials_hauled: sheet.materials_hauled,
        hauled_loads_quantity: sheet.hauled_loads_quantity,
        refueling_gallons: sheet.refueling_gallons,
        timesheet_comments: sheet.timesheet_comments,
        app_comment: sheet.app_comment,
        userId: sheet.userId,
        jobsite_id: sheet.jobsite_id
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
                                        <td>{new Date(sheet.submit_date).toLocaleDateString()}</td>
                                        <td>{new Date(sheet.date).toLocaleDateString()}</td>
                                        <td>{sheet.costcode}</td>
                                        <td>{sheet.vehicle_id}</td>
                                        <td>{sheet.start_time ? new Date(sheet.start_time).toLocaleTimeString() : ''}</td>
                                        <td>{sheet.end_time ? new Date(sheet.end_time).toLocaleTimeString() : ''}</td>
                                        <td>{sheet.duration}</td>
                                        <td>{sheet.starting_mileage}</td>
                                        <td>{sheet.ending_mileage}</td>
                                        <td>{sheet.left_idaho ? "Yes" : "No"}</td>
                                        <td>{sheet.equipment_hauled}</td>
                                        <td>{sheet.materials_hauled}</td>
                                        <td>{sheet.hauled_loads_quantity}</td>
                                        <td>{sheet.refueling_gallons}</td>
                                        <td>{sheet.timesheet_comments}</td>
                                        <td>{sheet.app_comment}</td>
                                        <td>{sheet.userId}</td>
                                        <td>{sheet.jobsite_id}</td>
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