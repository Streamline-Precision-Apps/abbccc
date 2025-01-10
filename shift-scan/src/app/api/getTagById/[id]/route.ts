"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const tags = await prisma.cCTag.findUnique({
      where: {
        id: String(id),
      },
      include: {
        jobsites: {
          select: {
            id: true,
            qrId: true,
            name: true,
          },
        },
        costCodes: {
          select: {
            id: true,
            name: true,
            description: true,
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
