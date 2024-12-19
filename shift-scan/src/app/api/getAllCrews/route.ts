"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    const userCrewData = await prisma.crew.findMany({
      orderBy: {
        name: "asc",
      },
    });

    revalidateTag("crews");

    return NextResponse.json(userCrewData);
  } catch (error) {
    console.error("Error fetching crews:", error);
    return NextResponse.json(
      { error: "Failed to fetch crews" },
      { status: 500 }
    );
  }
}
