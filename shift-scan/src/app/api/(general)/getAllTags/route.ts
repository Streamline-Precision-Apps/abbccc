import { NextResponse } from 'next/server';
import { unstable_cache } from "next/cache";
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
    // Create a cached function for fetching tags
    const getCachedTags = unstable_cache(
      async () => {
        return await prisma.cCTag.findMany();
      },
      ["all-tags"],
      {
        tags: ["tags"],
        revalidate: 3600, // Cache for 1 hour
      }
    );

    const tags = await getCachedTags();

    if (!tags || tags.length === 0) {
      return NextResponse.json(
        { message: 'No tags found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tags);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching tags:', error);

    let errorMessage = 'Failed to fetch tags';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
