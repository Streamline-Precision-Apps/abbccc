import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { lastSeen: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating user presence:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
