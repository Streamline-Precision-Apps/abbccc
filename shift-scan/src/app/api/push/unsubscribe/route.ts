import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../../prisma/generated/prisma/client";

export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { endpoint } = await req.json();
    if (endpoint) {
      await prisma.pushSubscription
        .delete({ where: { endpoint } })
        .catch(() => {});
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
