"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recentEquipment = await prisma.equipment.findMany({
        select: {
          id: true,
          qrId: true,
          name: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });
      
return NextResponse.json(recentEquipment);
}