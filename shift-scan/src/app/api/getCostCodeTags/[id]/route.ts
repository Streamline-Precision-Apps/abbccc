"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tags = await prisma.costCode.findMany({
      where: {
        id: String(params.id),
      },
      select: {
        CCTags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
