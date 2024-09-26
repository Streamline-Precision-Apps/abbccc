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

    const equipment = await prisma.equipment.findMany({});

return NextResponse.json(equipment);
}