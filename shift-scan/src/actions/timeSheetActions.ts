"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


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
                total_break_time: formData.get("total_break_time") ? Number(formData.get("total_break_time")) : 0,
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
        const timesheetId = newTimeSheet.id;

        // Revalidate the path
        await revalidatePath(`/clock/success/${timesheetId}`);
        
        // Redirect to the success page
        redirect(`/clock/success/${timesheetId}`);

} catch (error) {
    console.error("Error creating timesheet:", error);
    throw error;
}
}

// provides a way to update a timesheet and will give supervisor access to all timesheets
// and provide a way to alter them as needed by employee accuracy. 
export async function updateTimeSheet(formData: FormData, id: number) {
    try {
    await prisma.timeSheet.update({
    where: { id },
    data: {
        submit_date: formData.get("submit_date") as string,
        userId: formData.get("employee_id") as string,
        date: formData.get("date") as string,
        jobsite_id: formData.get("jobsite_id") as string,
        costcode: formData.get("costcode") as string,
        nu:   formData.get("nu") as string,
        Fp:   formData.get("Fp") as string,
        vehicle_id: Number(formData.get("vehicle_id") ),
        start_time: formData.get("start_time") as string,
        end_time: formData.get("end_time") as string,
        total_break_time: Number(formData.get("total_break_time") as string),
        duration: Number(formData.get("duration") as string),
        starting_mileage: Number(formData.get("starting_mileage") ),
        ending_mileage: Number(formData.get("ending_mileage") ),
        left_idaho: Boolean(formData.get("left_idaho")),
        equipment_hauled: formData.get("equipment_hauled") as string,
        materials_hauled: formData.get("materials_hauled") as string,
        hauled_loads_quantity: Number(formData.get("hauled_loads_quantity") ),
        refueling_gallons: Number(formData.get("refueling_gallons") ),
        timesheet_comments: formData.get("timesheet_comments") as string,
        app_comment: formData.get("app_comment") as string
    },
    });
} catch(error){
    console.log(error);
}
    revalidatePath('/');
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
