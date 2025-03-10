"use server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const session = await auth();
  const manager = session?.user.permission;
  if (manager === "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const Signature = await prisma.user.findUnique({
      where: {
        id: (await params).id,
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
