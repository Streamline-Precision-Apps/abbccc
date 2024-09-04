"use server";
import prisma from "@/lib/prisma";
import Content from "./content";

export default async function Page({ params }: { params: { id: string } }) {
    // get current data 
    const currentDate = new Date();
    // taking the current date find the past 24 hoursof equipment records
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    // get necessary data from the equipment log but find it based off url
    const equipmentform = await prisma.employeeEquipmentLog.findUnique({
        where: {
            id: Number(params.id),
        },
        include: {
            Equipment: true,
        },
    });

    // find all other related logs the past 24 hours that are not submitted
    // this enables us to prevent user from clocking out.
    const usersLogs = await prisma.employeeEquipmentLog.findMany({
        where: {
            id: Number(params.id),
            createdAt: { lte: currentDate, gte: past24Hours },
            submitted: false
        },

    })
    // Extract values from equipment form and creates and pass individual props of items
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
        <Content name={eqname} eqid={eqid} start_time={start_time} completed={completed} fuelUsed={fuelUsed} savedDuration={savedDuration} filled={filled} equipment_notes={equipment_notes} usersLogs={usersLogs} />
        )
    }