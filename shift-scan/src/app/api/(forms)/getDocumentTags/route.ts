import { NextResponse } from 'next/server';
import { unstable_cache } from "next/cache";
import prisma from '@/lib/prisma';
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create a cached function for fetching document tags
    const getCachedDocumentTags = unstable_cache(
      async () => {
        return await prisma.documentTag.findMany({
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
      },
      ["document-tags"],
      {
        tags: ["document-tags"],
        revalidate: 30 * 60, // Cache for 30 minutes
      }
    );

    // Get the cached document tags
    const tags = await getCachedDocumentTags();
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch document tags" },
      { status: 500 }
    );
  }
}