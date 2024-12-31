"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
type Params = Promise<{ id: string }>;
export async function GET(request: Request, { params: id }: { params: Params }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formId = String((await id).id);
    if (formId) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const usersLogs = await prisma.employeeEquipmentLog.findMany({
      where: {
        employeeId: userId,
        id: formId,
        createdAt: {
          lte: currentDate,
          gte: past24Hours,
        },
        isSubmitted: false,
      },
      include: {
        Equipment: {
          select: {
            name: true,
          },
          
        },
      },
    });
    console.log("usersLogs: ", usersLogs);
    return NextResponse.json(usersLogs);
  } catch (error) {
    console.error("Error fetching users logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch users logs" },
      { status: 500 }
    );
  }
}
