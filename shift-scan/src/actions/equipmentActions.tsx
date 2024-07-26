
"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function CreateEmployeeEquipmentLog(formData: FormData) {
try {
    console.log("Creating EmployeeEquipmentLog...");
    console.log(formData);
    const employeeId = formData.get("employee_id") as string;
    const equipmentQrId = formData.get("equipment_id") as string;
    const jobsiteId = formData.get("jobsite_id") as string;

    // Check if the related records exist form of errror handling
    const [employee, equipment, jobsite] = await Promise.all([
    prisma.user.findUnique({ where: { id: employeeId } }),
    prisma.equipment.findUnique({ where: { qr_id: equipmentQrId } }),
    prisma.jobsite.findUnique({ where: { jobsite_id: jobsiteId } })
    ]);

    if (!employee) throw new Error(`Employee with id ${employeeId} does not exist`);
    if (!equipment) throw new Error(`Equipment with qr_id ${equipmentQrId} does not exist`);
    if (!jobsite) throw new Error(`Jobsite with id ${jobsiteId} does not exist`);

    const log = await prisma.employeeEquipmentLog.create({
    data: {
        start_time: formData.get('start_time') as string,
        end_time: formData.get('end_time') as string,
        duration: Number(formData.get('duration') as string) || null,
        equipment_notes: formData.get('equipment_notes') as string,
        employee: { connect: { id: employeeId } },
        Equipment: { connect: { qr_id: equipmentQrId } },
        Job: { connect: { jobsite_id: jobsiteId } }
    }
    });

    revalidatePath('/');
    return log;
} catch (error:any) {
    console.error("Error creating employee equipment log:", error);
    throw new Error(`Failed to create employee equipment log: ${error.message}`);
}
}
