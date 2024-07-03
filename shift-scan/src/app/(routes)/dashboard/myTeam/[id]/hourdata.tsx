import Calender from "@/components/calender";
import prisma from "@/lib/prisma";

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
        <div>
            <p>Total Hours: {totalHours}</p>
        </div>
    );


}