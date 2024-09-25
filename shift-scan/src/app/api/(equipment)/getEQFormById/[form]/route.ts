    "use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET( request: Request, { params }: { params: { form: string } }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
       // get current data 
       const currentDate = new Date();
       // taking the current date find the past 24 hoursof equipment records
       const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
   
       // get necessary data from the equipment log but find it based off url
       const equipmentform = await prisma.employeeEquipmentLogs.findUnique({
           where: {
               id: Number(params.form),
           },
           include: {
               Equipment: true,
           },
       });
       const userNotes = await prisma.employeeEquipmentLogs.findUnique({
           where: {
               id: Number(params.form),
               employeeId: userId,
           }
       })
   
       // find all other related logs the past 24 hours that are not submitted
       // this enables us to prevent user from clocking out.
       const usersLogs = await prisma.employeeEquipmentLogs.findMany({
           where: {
               id: Number(params.form),
               employeeId: userId,
               createdAt: { lte: currentDate, gte: past24Hours },
               isSubmitted: false
           },
   
       })

    return NextResponse.json({ equipmentform, userNotes, usersLogs }, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}