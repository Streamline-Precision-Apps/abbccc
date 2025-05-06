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
    const equipment = await prisma.equipment.findMany({
      select: {
        id: true,
        qrId: true,
        name: true,
        DocumentTags: {  // Include the DocumentTags relation
          select: {
            tagName: true
          }
        }
      },
      where: {
        isActive: true  // Optional: only fetch active equipment
      }
    });
    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch document equipment" },
      { status: 500 }
    );
  }
}