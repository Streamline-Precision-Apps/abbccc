import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Prevent caching for dynamic data

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //Add isActive filter to only get active forms for user
  const forms = await prisma.formTemplate.findMany({
    where: {
      isActive: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(forms);
}
