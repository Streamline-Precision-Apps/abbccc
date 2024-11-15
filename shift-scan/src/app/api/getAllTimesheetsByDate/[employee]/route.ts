"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { employee: string } }
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { employee } = params;
  const url = new URL(request.url);
  const dateQuery = url.searchParams.get("date");

  if (!dateQuery) {
    return;
  }
  const date = new Date(dateQuery);

  try {
    const timesheets = await prisma.timeSheets.findMany({
      where: {
        userId: employee,
        date: {
          equals: date,
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(timesheets);
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheets" },
      { status: 500 }
    );
  }
}
