"use server";
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.cCTag.findMany();

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
