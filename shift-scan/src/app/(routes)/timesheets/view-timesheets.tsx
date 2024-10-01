"use client";

import React, { useEffect, useState } from "react";
import { Inputs } from "@/components/(reusable)/inputs";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Forms } from "@/components/(reusable)/forms";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { Labels } from "@/components/(reusable)/labels";
import { TimeSheet } from "@/lib/types";
import { Dividers } from "@/components/(reusable)/dividers";
import Spinner from "@/components/(animations)/spinner";
import { formatTime } from "@/utils/formatDateAMPMS";

type Props = {
    user: string | undefined;
};

export default function ViewTimesheets({ user }: Props) {
    const [showTimesheets, setShowTimesheets] = useState(false);
    const [startingEntry, setStartingEntry] = useState(false);
    const [timesheetData, setTimesheetData] = useState<TimeSheet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch timesheets from the API
    const fetchTimesheets = async (date?: string) => {
        setLoading(true);
        try {
            const queryParam = date ? `?date=${date}` : '';
            const response = await fetch(`/api/getTimesheets${queryParam}`); // Include the query parameter if provided
    
            if (!response.ok) {
                throw new Error('Failed to fetch timesheets');
            }
    
            const data: TimeSheet[] = await response.json();
            setTimesheetData(data);
            setShowTimesheets(true);
        } catch (error) {
            setError('Error fetching timesheets');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const date = formData.get('date')?.toString(); // Get the selected date from the form
        await fetchTimesheets(date);
    };

    const currentDate = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD

    return (
        <Holds>
            <Holds background={"white"} className="mb-10 p-4">
                <Texts>Please enter a date to search for your timesheets.</Texts>
                <Forms onSubmit={handleSubmit}>
                    <Inputs type="hidden" name="id" value={user} readOnly />
                    <Labels>Enter Date</Labels>
                    <Inputs type="date" name="date" defaultValue={currentDate} />
                    <Buttons type="submit" background={"lightBlue"}>
                        Submit
                    </Buttons>
                </Forms>
            </Holds>
            {loading ? 
            (<>
            <Holds 
            background={"white"} 
            size={"full"}>
                <Holds position={"center"} size={"50"} className="my-10">
                    <Spinner />
                    <Titles size={"h3"}>Loading...</Titles>
                </Holds>
            </Holds> 
            </>
            )
            : 
            (
            <>
            {showTimesheets ? (
                <Holds background={"white"} size={"full"}>
                    {timesheetData.length > 0 ? <Titles size={"h2"} className="pt-8">{`Timesheets Found (${timesheetData.length })` }
                    </Titles>
                    : <Titles size={"h2"} className="pt-8">No Timesheets Found</Titles>}
                    {timesheetData.length > 0 ? (
                        timesheetData.map((timesheet) => (
                            <Holds key={timesheet.id} size={"full"} className="odd:bg-app-blue ro">
                                <Holds size={"70"} className="p-4 py-8">
                                    <Labels>
                                        Timesheet ID:
                                        <Inputs value={timesheet.id} readOnly />
                                    </Labels>
                                    <Labels>
                                    Start Time:
                                        <Inputs
                                            value={
                                                timesheet.startTime
                                                    ? formatTime(timesheet.startTime.toString()) // Format to 12-hour time with seconds and AM/PM
                                                    : "N/A"
                                            }
                                            readOnly
                                        />
                                </Labels>
                                <Labels>
                                    End Time:
                                    <Inputs
                                        value={
                                            timesheet.endTime
                                                ? formatTime(timesheet.endTime.toString()) // Format to 12-hour time with seconds and AM/PM
                                                : "N/A"
                                        }
                                        readOnly
                                    />
                                </Labels>
                                    <Labels>
                                        Duration:
                                        <Inputs value={timesheet.duration?.toFixed(2) || "N/A"} readOnly />
                                    </Labels>
                                    <Labels>
                                        Jobsite ID:
                                        <Inputs value={timesheet.jobsiteId} readOnly />
                                    </Labels>
                                    <Labels>
                                        Cost Code:
                                        <Inputs value={timesheet.costcode} readOnly />
                                    </Labels>
                                </Holds>
                            </Holds>
                        ))
                    ) : (
                        <Texts size={"p3"} className="py-8">Try again with a different date.</Texts>
                    )}
                </Holds>
            ) : (
                <Holds background={"white"} className="pb-10">
                    {startingEntry ? (
                        <>
                            <Titles size={"h2"}>Results</Titles>
                            <Dividers />
                            <Texts>No timesheets found for this period.</Texts>
                        </>
                    ) : (
                        <>
                            <Texts size={"p3"}>Enter a date and Submit to search for your Timesheets.</Texts>
                        </>
                    )}
                </Holds>
            )}
            {error && <Texts className="text-red-500">{error}</Texts>}
            </>)}
        </Holds>
    );
}