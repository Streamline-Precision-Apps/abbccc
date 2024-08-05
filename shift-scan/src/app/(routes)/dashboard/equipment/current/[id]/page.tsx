"use server";
import prisma from "@/lib/prisma";
import Base from "./base";

export default async function Page({ params }: { params: { id: string } }) {
    const equipmentform = await prisma.employeeEquipmentLog.findUnique({
        where: {
            id: Number(params.id),
        },
        include: {
            Equipment: true,
        },
    });


    // Extract values from equipment form
    const start_time = new Date(equipmentform?.start_time ?? "");
    const completed = equipmentform?.completed;
    const savedDuration = equipmentform?.duration?.toFixed(2);
    const filled = equipmentform?.refueled;
    const fuelUsed = equipmentform?.fuel_used?.toString();
    const eqname = equipmentform?.Equipment?.name?.toString();
    const eqid = equipmentform?.id?.toString();
    const equipment_notes = equipmentform?.equipment_notes;

    // Log counts for debugging
        return (
        <> 
            <Base name={eqname} eqid={eqid} start_time={start_time} completed={completed} fuelUsed={fuelUsed} savedDuration={savedDuration} filled={filled} equipment_notes={equipment_notes} />
            </>
        )
    }