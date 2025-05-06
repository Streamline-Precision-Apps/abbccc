import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tags = await prisma.documentTag.findMany({
      select: {
        id: true,
        tagName: true,
        Equipment: {
          select: {
            qrId: true,
          },
      },
    },
      orderBy: {
        tagName: 'asc'
      }
    });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch document tags" },
      { status: 500 }
    );
  }
}