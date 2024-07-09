"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


// Get all TimeSheets
export async function getTimeSheets() {
    const timeSheets = await prisma.timeSheet.findMany();
    return timeSheets;
}

// Get TimeSheet by id
export async function getTimeSheet(formData: FormData, id: number) {
    const timeSheet = await prisma.timeSheet.findUnique({
        where: {
            id: id,
        },
        include: {
            employee: true,
        },
    });
    return timeSheet;
}

// Create TimeSheet
// used at each login and will retain that timesheetId until the user logs out with switch jobsite
export async function createTimeSheet(formData: FormData) {
    try {
    await prisma.timeSheet.create({
    data: {
        submit_date: formData.get("submit_date") as string,
        id: parseInt(formData.get("id") as string),
        form_id: parseInt(formData.get("form_id") as string),
        employee_id: parseInt(formData.get("employee_id") as string),
        date: formData.get("date") as string,
        jobsite_id: parseInt(formData.get("jobsite_id") as string),
        costcode: formData.get("costcode") as string,
        nu:   formData.get("nu") as string,
        Fp:   formData.get("Fp") as string,
        vehicle_id: parseInt(formData.get("vehicle_id") as string),
        start_time: formData.get("start_time") as string,
        end_time: formData.get("end_time") as string,
        total_break_time: parseFloat(formData.get("total_break_time") as string),
        duration: parseFloat(formData.get("duration") as string),
        starting_mileage: parseInt(formData.get("starting_mileage") as string),
        ending_mileage: parseInt(formData.get("ending_mileage") as string),
        left_idaho: Boolean(formData.get("left_idaho")),
        equipment_hauled: formData.get("equipment_hauled") as string,
        materials_hauled: formData.get("materials_hauled") as string,
        hauled_loads_quantity: parseInt(formData.get("hauled_loads_quantity") as string),
        refueling_gallons: parseInt(formData.get("refueling_gallons") as string),
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
        form_id: parseInt(formData.get("form_id") as string),
        employee_id: parseInt(formData.get("employee_id") as string),
        date: formData.get("date") as string,
        jobsite_id: parseInt(formData.get("jobsite_id") as string),
        costcode: formData.get("costcode") as string,
        nu:   formData.get("nu") as string,
        Fp:   formData.get("Fp") as string,
        vehicle_id: parseInt(formData.get("vehicle_id") as string),
        start_time: formData.get("start_time") as string,
        end_time: formData.get("end_time") as string,
        total_break_time: parseFloat(formData.get("total_break_time") as string),
        duration: parseFloat(formData.get("duration") as string),
        starting_mileage: parseInt(formData.get("starting_mileage") as string),
        ending_mileage: parseInt(formData.get("ending_mileage") as string),
        left_idaho: Boolean(formData.get("left_idaho")),
        equipment_hauled: formData.get("equipment_hauled") as string,
        materials_hauled: formData.get("materials_hauled") as string,
        hauled_loads_quantity: parseInt(formData.get("hauled_loads_quantity") as string),
        refueling_gallons: parseInt(formData.get("refueling_gallons") as string),
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