"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    // Authenticate user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch employee details
    const TascoMaterialData = await prisma.tascoMaterialTypes.findMany();

    return NextResponse.json(TascoMaterialData);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching profile data:" },
      { status: 500 }
    );
  }
}
