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


    const totalHours = timeSheets.reduce((total, timeSheet) => total + timeSheet.duration, 0);
    
    return totalHours


}