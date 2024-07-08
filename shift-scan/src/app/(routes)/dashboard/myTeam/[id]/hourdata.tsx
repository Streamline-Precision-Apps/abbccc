"use server";
import prisma from "@/lib/prisma";
import EmployeeData from "./employeeData";

type Prop = {
    params: { id: string
}
}

export default async function HourData({params} : Prop) {
    const id = params.id


    const timeSheets = await prisma.timeSheet.findMany(
        {
            where: {
                employee_id: parseInt(id),
            }
        },
    );

    // an array of timesheets
    const totalHours = timeSheets.reduce((total, timesheets) => total + timesheets.duration, 10);
    
    return (
        <>
            <p className="text-center">Total Hours: {totalHours}</p>
            <div className="bg-white rounded-2xl">
            <EmployeeData params={params} />
            </div>
        </>
    );


}