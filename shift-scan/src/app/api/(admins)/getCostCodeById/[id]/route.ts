

import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * GET handler for fetching a cost code and its tags by ID (admin access).
 * @param req - The incoming HTTP request object.
 * @param params - Route parameters containing the cost code ID.
 * @returns JSON response with cost code and tag data, or error message.
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    // Authenticate user
    const session = await auth();
    const userId: string | null = session?.user?.id ?? null;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate the ID parameter
    if (!params.id) {
      return NextResponse.json(
        { error: 'Missing cost code ID' },
        { status: 400 }
      );
    }

    // Fetch complete cost code data with all relationships
    const costcodeData = await prisma.costCode.findUnique({
      where: {
        id: params.id,
      },
      include: {
        CCTags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!costcodeData) {
      return NextResponse.json(
        { error: 'Cost code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(costcodeData);
  } catch (error) {
    Sentry.captureException(error);
    // eslint-disable-next-line no-console
    console.error('Error fetching cost code data:', error);
    let errorMessage = 'Failed to fetch cost code data';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
