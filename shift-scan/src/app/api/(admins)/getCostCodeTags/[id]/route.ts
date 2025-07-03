import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the ID parameter
    if (!params.id) {
      return NextResponse.json({ error: "Missing cost code ID" }, { status: 400 });
    }

    // Fetch cost code tags
    const tags = await prisma.costCode.findUnique({
      where: { id: params.id },
      select: {
        CCTags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!tags || !tags.CCTags || tags.CCTags.length === 0) {
      return NextResponse.json(
        { message: "No tags found for the given cost code ID." },
        { status: 404 }
      );
    }

    return NextResponse.json(tags.CCTags);
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
