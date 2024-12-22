"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.cCTag.findMany({});
    return NextResponse.json(tags);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
