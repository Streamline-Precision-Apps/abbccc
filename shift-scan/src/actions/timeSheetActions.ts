"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAuthStep, setAuthStep } from "@/app/api/auth";


const prisma = new PrismaClient();


// Get all TimeSheets
export async function getTimeSheetsbyId() {
    const timesheets = prisma.timeSheet.findMany();
    console.log(timesheets);
    return timesheets
}


// Get TimeSheet by id
export async function fetchTimesheets(employeeId: string, date: string) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const timeSheets = await prisma.timeSheet.findMany({
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

// alter the timeSheet function to include the date
export async function handleFormSubmit(employeeId: string, date: string) {
    date = new Date(date).toISOString();
    return fetchTimesheets(employeeId, date);
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

        const newTimeSheet = await prisma.timeSheet.create({
            data: {
                submit_date: parseDate(formData.get("submit_date") as string).toISOString(),
                date: parseDate(formData.get("date") as string).toISOString(),
                costcode: formData.get("costcode") as string,
                vehicle_id: formData.get("vehicle_id") ? Number(formData.get("vehicle_id")) : null,
                start_time: parseDate(formData.get("start_time") as string).toISOString(),
                end_time: formData.get("end_time") ? parseDate(formData.get("end_time") as string).toISOString() : null,
                total_break_time: formData.get("total_break_time") ? Number(formData.get("total_break_time")) : null,
                duration: formData.get("duration") ? Number(formData.get("duration") as string) : null,
                starting_mileage: formData.get("starting_mileage") ? Number(formData.get("starting_mileage")) : null,
                ending_mileage: formData.get("ending_mileage") ? Number(formData.get("ending_mileage")) : null,
                left_idaho: formData.get("left_idaho") ? Boolean(formData.get("left_idaho")) : null,
                equipment_hauled: formData.get("equipment_hauled") as string || null,
                materials_hauled: formData.get("materials_hauled") as string || null,
                hauled_loads_quantity: formData.get("hauled_loads_quantity") ? Number(formData.get("hauled_loads_quantity")) : null,
                refueling_gallons: formData.get("refueling_gallons") ? Number(formData.get("refueling_gallons")) : null,
                timesheet_comments: formData.get("timesheet_comments") as string || null,
                app_comment: formData.get("app_comment") as string || null,
                user: { connect: { id: formData.get("userId") as string } },
                jobsite: { connect: { jobsite_id: formData.get("jobsite_id") as string } }
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

// provides a way to update a timesheet and will give supervisor access to all timesheets
// and provide a way to alter them as needed by employee accuracy. 
export async function updateTimeSheet(formData: FormData, id: string) {
    try {
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
    const id = Number(formData.get("id"));
    const end_time = parseUTC(formData.get("end_time"));
    const start_time = parseUTC(formData.get("start_time"));
    const duration = Math.floor(end_time.getSeconds() - start_time.getSeconds()) / 3600; // Duration in hours
    const updatedTimeSheet = await prisma.timeSheet.update({
    where: { id },
    data: {

        vehicle_id: Number(formData.get("vehicle_id") ) || null,
        end_time: parseDate(formData.get("end_time") as string).toISOString(),
        total_break_time: Number(formData.get("total_break_time") as string),
        duration: duration || null,
        starting_mileage: Number(formData.get("starting_mileage") ) || null,
        ending_mileage: Number(formData.get("ending_mileage") ) || null,
        left_idaho: Boolean(formData.get("left_idaho")) || null,
        equipment_hauled: formData.get("equipment_hauled") as string || null,
        materials_hauled: formData.get("materials_hauled") as string || null,
        hauled_loads_quantity: Number(formData.get("hauled_loads_quantity") ) || null,
        refueling_gallons: Number(formData.get("refueling_gallons") ) || null,
        timesheet_comments: formData.get("timesheet_comments") as string,
        app_comment: formData.get("app_comment") as string
    },
    });
    console.log("Timesheet updated successfully.");
    console.log(updatedTimeSheet);
    setAuthStep("");
    
    // Revalidate the path
    await revalidatePath(`/`);

    // Redirect to the success page
    redirect(`/dashboard/clock-out/clock-out-success`);

} catch(error){
    console.log(error);
}
}


// Delete TimeSheet by id
// will be used by Admin only
export async function deleteTimeSheet(id: number) {
    await prisma.timeSheet.delete({
        where: { id },
    });
}

function resdirect(arg0: string) {
    throw new Error("Function not implemented.");
}
