import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;

  const projects = await prisma.maintenance.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      equipmentId: true,
      equipmentIssue: true,
      additionalInfo: true,
      location: true,
      priority: true,
      createdBy: true,
      createdAt: true,
      hasBeenDelayed: true,
      delay: true,
      delayReasoning: true,
      totalHoursLaboured: true,
      problemDiagnosis: true,
      solution: true,
      repaired: true,
      Equipment: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

    return NextResponse.json(projects);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching maintenance project details:', error);

    let errorMessage = 'Failed to fetch maintenance project details';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
