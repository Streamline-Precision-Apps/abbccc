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

    const jobCodes = await prisma.jobsite.findMany({
        select: {
            id: true,
            qrId: true,
            name: true,
            },
    });


   return NextResponse.json(jobCodes);
}