"use client";
import React, { useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { Holds } from "@/components/(reusable)/Holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Forms } from "@/components/(reusable)/forms";
import { findTimesheetsforDay } from "@/actions/timeSheetActions";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { Labels } from "@/components/(reusable)/labels";
import { TimeSheet } from "@/lib/types";

type Props = {
    timesheets: TimeSheet[]
    user : string | undefined
}
export default function ViewTimesheets({ timesheets, user }: Props) {
    const [showTimesheets, setShowTimesheets] = useState(false);
    const [timesheetData, setTimesheetData] = useState<TimeSheet[]>([]);

    const handleSubmit = async (formData: FormData) => {
        const result = await findTimesheetsforDay(formData);
        if (result && result.length > 0) {
            setTimesheetData(result);
            setShowTimesheets(true);
        }
        else {
            setShowTimesheets(false);
            setTimesheetData([]);
        }
    };

    const currentDate = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD

    return (
        <Bases>
            <Contents size={"default"} variant={"default"}>
                <Holds size={"titleBox"} variant={"default"}>
                    <TitleBoxes title={"View Timesheets"} titleImg={"/"} titleImgAlt={"no image"} type="noIcon" />
                </Holds>
                <Holds size={"dynamic"}>
                    <Contents variant={"default"} size={null}>
                        <Texts>Please enter a date to search for your timesheets.</Texts>
                        <Forms action={handleSubmit}>
                            <Inputs type="hidden" name="id" value={user} readOnly />
                            <Labels size="default" type="title">Enter Date</Labels>
                            <Inputs type="date" name="date" defaultValue={currentDate} />
                            <Buttons type="submit" variant={"lightBlue"} size={null}>Submit</Buttons>
                        </Forms>
                    </Contents>
                    {showTimesheets ? (
                        <Contents variant={"default"} size={null}>
                            {timesheetData.length > 0 ? (
                                timesheetData.map((timesheet) => (
                                    <Contents key={timesheet.id} variant={"green"} size={null}>
                                        <Texts>Timesheet ID: {timesheet.id}</Texts>
                                        <Texts>Start Time: {timesheet.startTime?.toLocaleString()}</Texts>
                                        <Texts>End Time: {timesheet.endTime?.toLocaleString() || "N/A"}</Texts>
                                        <Texts>Duration: {(timesheet.duration)?.toFixed(2)}</Texts>
                                        <Texts>Jobsite ID: {timesheet.jobsiteId}</Texts>
                                        <Texts>Cost Code: {timesheet.costcode}</Texts>
                                    </Contents>
                                ))
                            ): null}
                        </Contents>
                    ): (
                        <Texts>You were not working a shift that day. No Timesheets Found. </Texts>
                    )}
                </Holds>
            </Contents>
        </Bases>
    );
}