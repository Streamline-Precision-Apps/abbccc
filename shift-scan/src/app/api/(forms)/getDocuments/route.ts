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
    const documents = await prisma.pdfDocument.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        qrId: true,
        fileName: true,
        description: true,
        DocumentTags: {
          select: {
            tagName: true
          }
        }
      },
      orderBy: {
        fileName: 'asc'
      }
    });
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }

}