"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function getAllForms() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const forms = await prisma.formTemplate.findMany({
      select: {
        id: true,
        name: true,
        fields: true,
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching equipment data:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment data" },
      { status: 500 }
    );
  }
}
