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
    if (!formId) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const usersLog = await prisma.employeeEquipmentLog.findUnique({
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
            status: true,
          },
        },
        refueled: true,
      },
    });
    console.log("usersLog: ", usersLog);
    return NextResponse.json(usersLog);
  } catch (error) {
    console.error("Error fetching users log:", error);
    return NextResponse.json(
      { error: "Failed to fetch users log" },
      { status: 500 }
    );
  }
}
