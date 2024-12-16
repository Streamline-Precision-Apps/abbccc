"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const costcodeData = await prisma.costCodes.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  return NextResponse.json(costcodeData);
}
