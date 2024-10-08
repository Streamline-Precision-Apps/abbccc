"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Signature from "@/components/(signup)/signature";

export async function GET({ params }: { params: { employeeId: string } }) {
  const session = await auth();
  const manager = session?.user.permission;
  if (manager === "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const Signature = await prisma.users.findUnique({
      where: {
        id: params.employeeId,
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
