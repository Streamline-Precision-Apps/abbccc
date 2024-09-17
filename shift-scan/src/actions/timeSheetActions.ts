"use server";
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
                jobsite: { connect: { id: formData.get("jobsiteId") as string } },
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
                hauledLoadsQuantity:  null,
                refuelingGallons:  null,
                timeSheetComments: null,
                user: { connect: { id: formData.get("user_id") as string } },
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
export async function updateTimeSheet(formData: FormData, id?: string) {
    try {
        console.log("formData:", formData);
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
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                throw new RangeError(`Invalid time value: ${timestamp}`);
            }
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for the timezone offset
            return date;
        };
        const endTime = parseDate(formData.get("endTime") as string);

        const durationMs = endTime.getTime() - new Date(startTime).getTime();
        const durationHours = (durationMs / (1000 * 60 * 60));
        const duration = (durationHours);

        console.log(`{endTime}: ${endTime} - {startTime}: ${startTime} = duration: ${durationHours}`);

        const updatedTimeSheet = await prisma.timeSheets.update({
            where: { id },
            data: {
                vehicleId: Number(formData.get("vehicleId")) || null,
                endTime: endTime.toISOString(),
                duration: Number(duration) || null,
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

        // Revalidate the path
        revalidatePath(`/`);
        return updatedTimeSheet;

    } catch (error) {
        console.log(error);
    }
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
    const date = new Date(formData.get("date") as string).toISOString(); 

    const timeSheets = await prisma.timeSheets.findMany({
        where: {
            userId: id,
            date: {
                equals: date
            }
        }
    });
    if (timeSheets.length === 0) {
        return null;
    }
    else {
    return timeSheets;
    }
}