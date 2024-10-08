"use server";
import { setAuthStep } from "@/app/api/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";




// Get all TimeSheets
export async function getTimeSheetsbyId() {
    const timesheets = prisma.timeSheets.findMany();
    console.log(timesheets);
    return timesheets
}


// Get TimeSheet by id
export async function fetchTimesheets(employeeId: string, date: string) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const timeSheets = await prisma.timeSheets.findMany({
        where: {
            userId: employeeId,
            date: {
                gte: startOfDay.toISOString(),
                lte: endOfDay.toISOString(),
            },
        },
    });

    console.log("\n\n\nTimeSheets:", timeSheets);
    return timeSheets;
}


// Create TimeSheet
// used at each login and will retain that timesheetId until the user logs out with switch jobsite
export async function CreateTimeSheet(formData: FormData) {
    try {
        console.log("entered CreateTimeSheet:");
        console.log("formData:", formData);
        const parseDate = (timestamp: string) => {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                throw new RangeError(`Invalid time value: ${timestamp}`);
            }
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            return date;
        };

        const newTimeSheet = await prisma.timeSheets.create({
            data: {
                submitDate: parseDate(formData.get("submitDate") as string).toISOString(),
                date: parseDate(formData.get("date") as string).toISOString(),
                jobsite: { connect: { qrId: formData.get("jobsiteId") as string } },
                costcode: formData.get("costcode") as string,
                vehicleId: formData.get("vehicleId") ? Number(formData.get("vehicleId")) : null,
                startTime: parseDate(formData.get("startTime") as string).toISOString(),
                endTime: null,
                duration: null,
                startingMileage: formData.get("startingMileage") ? Number(formData.get("startingMileage")) : null,
                endingMileage: null,
                leftIdaho: null,
                equipmentHauled: null,
                materialsHauled: null,
                hauledLoadsQuantity: null,
                refuelingGallons: null,
                timeSheetComments: null,
                user: { connect: { id: formData.get("userId") as string } },
            },
        });

        return newTimeSheet;
    } catch (error) {
        console.error("Error creating timesheet:", error);
        throw error;
    }
}

// Create TimeSheet
// used at each login and will retain that timesheetId until the user logs out with switch jobsite
export async function AddWholeTimeSheet(formData: FormData) {
    try {
        console.log("Creating Timesheet...");
        console.log(formData);

        const parseDate = (timestamp: string) => {
            const date = new Date(timestamp); // Directly parse the string as a date
            if (isNaN(date.getTime())) {
                throw new RangeError(`Invalid time value: ${timestamp}`);
            }
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for the timezone offset
            return date;
        };

        const newTimeSheet = await prisma.timeSheets.create({
            data: {
                submitDate: parseDate(formData.get("submitDate") as string).toISOString(),
                date: parseDate(formData.get("date") as string).toISOString(),
                jobsite: { connect: { qrId: formData.get("jobsiteId") as string } },
                costcode: formData.get("costcode") as string,
                vehicleId: formData.get("vehicleId") ? Number(formData.get("vehicleId")) : null,
                startTime: parseDate(formData.get("startTime") as string).toISOString(),
                endTime: formData.get("endTime") ? parseDate(formData.get("endTime") as string).toISOString() : null,
                duration: formData.get("duration") ? Number(formData.get("duration")) : null,
                startingMileage: formData.get("startingMileage") ? Number(formData.get("startingMileage")) : null,
                endingMileage: formData.get("endingMileage") ? Number(formData.get("endingMileage")) : null,
                leftIdaho: formData.get("leftIdaho") ? Boolean(formData.get("leftIdaho")) : null,
                equipmentHauled: formData.get("equipmentHauled") ? (formData.get("equipmentHauled") as string) : null,
                materialsHauled: formData.get("materialsHauled") ? (formData.get("materialsHauled") as string) : null,
                hauledLoadsQuantity:  formData.get("hauledLoadsQuantity") ? Number(formData.get("hauledLoadsQuantity")) : null,
                refuelingGallons:  formData.get("refuelingGallons") ? Number(formData.get("refuelingGallons")) : null,
                timeSheetComments: formData.get("timeSheetComments") ? (formData.get("timeSheetComments") as string) : null,
                user: { connect: { id: formData.get("userId") as string } },
            },
        });
        console.log("Timesheet created successfully.");
        return newTimeSheet;
        
} catch (error) {
    console.error("Error creating timesheet:", error);
    throw error;
}
}

function parseUTC(dateString: any) {
    const date = new Date(dateString);
    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    ));
}




export async function editTimeSheet(formData: FormData) {
        console.log("Editing Timesheet...");
        console.log(formData);
    
        function parseUTC(timestamp: string): Date {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            throw new RangeError(`Invalid time value: ${timestamp}`);
        }
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date;
        }
    
        const id = formData.get("id");
        const employeeId = formData.get("employeeId");
        const costcode = formData.get("costcode");
        const endTime = parseUTC(formData.get("endTime") as string);
        const startTime = parseUTC(formData.get("startTime") as string);
        const duration = ((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) );

        if (!id) {
        throw new Error("ID is required");
        }
    
        const timeSheet = await prisma.timeSheets.update({
        where: { id: Number(id) },
        data: {
            costcode: costcode as string,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: Number(duration),
        },
        });
    
        console.log(timeSheet);
    }






// provides a way to update a timesheet and will give supervisor access to all timesheets
// and provide a way to alter them as needed by employee accuracy. 
export async function updateTimeSheet(formData: FormData) {
    try {
        console.log("formData:", formData);
        const id = Number(formData.get("id")); // Removed the second id parameter from the function
        
        // Fetch the startTime from the database to prevent irregular dates
        const start = await prisma.timeSheets.findUnique({
            where: { id },
            select: { startTime: true },
        });

        const startTime = start?.startTime;
        if (!startTime) {
            throw new Error("Start time not found for the given timesheet ID.");
        }

        // Parse endTime from the formData
        const parseDate = (timestamp: string) => {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                throw new RangeError(`Invalid time value: ${timestamp}`);
            }
            return date; // Removed manual timezone adjustment
        };

        const endTime = parseDate(formData.get("endTime") as string);

        // Calculate duration between start and end times
        const durationMs = endTime.getTime() - new Date(startTime).getTime();
        const durationHours = durationMs / (1000 * 60 * 60); // Convert ms to hours
        const duration = Number.isNaN(durationHours) ? null : durationHours;

        console.log(`{endTime}: ${endTime} - {startTime}: ${startTime} = duration: ${durationHours}`);

        // Update the timesheet with new data
        const updatedTimeSheet = await prisma.timeSheets.update({
            where: { id },
            data: {
                vehicleId: Number(formData.get("vehicleId")) || null,
                endTime: endTime.toISOString(),
                duration: duration,
                startingMileage: Number(formData.get("startingMileage")) || null,
                endingMileage: Number(formData.get("endingMileage")) || null,
                leftIdaho: Boolean(formData.get("leftIdaho")) || null,
                equipmentHauled: formData.get("equipmentHauled") as string || null,
                materialsHauled: formData.get("materialsHauled") as string || null,
                hauledLoadsQuantity: Number(formData.get("hauledLoadsQuantity")) || null,
                refuelingGallons: Number(formData.get("refuelingGallons")) || null,
                timeSheetComments: formData.get("timeSheetComments") as string,
            },
        });

        console.log("Timesheet updated successfully.");
        console.log(updatedTimeSheet);

        // Optionally, you can handle revalidation of paths here or elsewhere
        revalidatePath(`/`);

    } catch (error) {
        console.error("Error updating timesheet:", error);    }
}


export async function updateTimeSheetBySwitch(formData: FormData) {
    try {

        console.log("formData:", formData);
        console.log("switch jobsite, updating Timesheet...");

        const id = Number(formData.get("id"));
        
        // Fetch the startTime from the database to prevent irregular dates
        const start = await prisma.timeSheets.findUnique({
            where: { id },
            select: { startTime: true },
        });

        const startTime = start?.startTime;
        if (!startTime) {
            throw new Error("Start time not found for the given timesheet ID.");
        }

        const parseDate = (timestamp: string) => {
            const date = new Date(timestamp); // Directly parse the string as a date
            if (isNaN(date.getTime())) {
                throw new RangeError(`Invalid time value: ${timestamp}`);
            }
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for the timezone offset
            return date;
        };
    console.log("formData:", formData);
    console.log("Updating Timesheet...");
    const endTime = parseDate(formData.get("endTime") as string);
    
    const durationMs = endTime.getTime() - new Date(startTime).getTime();
    const durationHours = (durationMs / (1000 * 60 * 60));

    const duration = (durationHours );

    const updatedTimeSheet = await prisma.timeSheets.update({
    where: { id },
    data: {

        vehicleId: Number(formData.get("vehicleId") ) || null,
        endTime: parseDate(formData.get("endTime") as string).toISOString(),
        duration: Number(duration) || null,
        startingMileage: Number(formData.get("startingMileage") ) || null,
        endingMileage: Number(formData.get("endingMileage") ) || null,
        leftIdaho: Boolean(formData.get("leftIdaho")) || null,
        equipmentHauled: formData.get("equipmentHauled") as string || null,
        materialsHauled: formData.get("materialsHauled") as string || null,
        hauledLoadsQuantity: Number(formData.get("hauledLoadsQuantity") ) || null,
        refuelingGallons: Number(formData.get("refuelingGallons") ) || null,
        timeSheetComments: formData.get("timeSheetComments") as string,    },
    });
    console.log("Timesheet updated successfully.");
    console.log(updatedTimeSheet);
    
    // Revalidate the path
    revalidatePath(`/`);

} catch(error){
    console.log(error);
}
}


export async function GetAllTimeSheets(date: string) {
    date = new Date(date).toISOString();
    const timeSheets = await prisma.timeSheets.findMany({
        where: { date: { equals: date } },
    }
);
    return timeSheets;
}


// Delete TimeSheet by id
// will be used by Admin only
export async function deleteTimeSheet(id: number) {
    await prisma.timeSheets.delete({
        where: { id },
    });
}


export async function findTimesheetsforDay(formData: FormData) {
    console.log("formData:", formData);
    
    const id = formData.get("id") as string;
    const dateString = formData.get("date") as string;

    // Create a full local ISO string (including time)
    const localDateISO = new Date(dateString).toISOString();

    // Query for timesheets where the full ISO string matches
    const timeSheets = await prisma.timeSheets.findMany({
        where: {
            userId: id,
            date: {
                equals: localDateISO, // Match the full ISO string
            }
        }
    });

    if (timeSheets.length === 0) {
        return null;
    } else {
        return timeSheets;
    }
}