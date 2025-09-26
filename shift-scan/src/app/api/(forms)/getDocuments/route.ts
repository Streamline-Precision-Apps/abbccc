import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create a cached function for fetching active documents
    const getCachedDocuments = unstable_cache(
      async () => {
        return await prisma.pdfDocument.findMany({
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
      },
      ["active-documents"],
      {
        tags: ["documents"],
        revalidate: 30 * 60, // Cache for 30 minutes
      }
    );

    // Get the cached documents
    const documents = await getCachedDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }

}