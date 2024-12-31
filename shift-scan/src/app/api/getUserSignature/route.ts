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

  try {
    const Signature = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        signature: true,
      },
    });

    return NextResponse.json(Signature);
  } catch (error) {
    console.error("Error fetching pay period sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pay period sheets" },
      { status: 500 }
    );
  }
}
