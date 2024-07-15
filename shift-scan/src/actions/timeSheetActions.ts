"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

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
export async function createTimeSheet(formData: FormData) {
    try {
    await prisma.timeSheet.create({
    data: {
            submit_date: formData.get("submit_date") as string,
        id: Number(formData.get("id")),
        form_id: Number(formData.get("form_id")),
        userId: formData.get("employee_id") as string,
        date: formData.get("date") as string,
        jobsite_id: Number(formData.get("jobsite_id") ),
        costcode: formData.get("costcode") as string,
        nu:   formData.get("nu") as string,
        Fp:   formData.get("Fp") as string,
        vehicle_id: Number(formData.get("vehicle_id") ),
        start_time: formData.get("start_time") as string,
        end_time: formData.get("end_time") as string,
        total_break_time: Number(formData.get("total_break_time") ),
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

// provides a way to update a timesheet and will give supervisor access to all timesheets
// and provide a way to alter them as needed by employee accuracy. 
export async function updateTimeSheet(formData: FormData, id: number) {
    try {
    await prisma.timeSheet.update({
    where: { id },
    data: {
        submit_date: formData.get("submit_date") as string,
        form_id: Number(formData.get("form_id") ),
        userId: formData.get("employee_id") as string,
        date: formData.get("date") as string,
        jobsite_id: Number(formData.get("jobsite_id") ),
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