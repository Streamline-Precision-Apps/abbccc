import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * Get equipment details by QR code ID
 * Used by QR code scanner to fetch equipment information
 *
 * @param request - The incoming request
 * @param params - Route parameters containing the QR ID
 * @returns Equipment details or error response
 */
export async function GET(
  request: Request,
  { params }: { params: { qrId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const qrId = params.qrId;
    if (!qrId) {
      return NextResponse.json(
        { error: "Invalid or missing QR ID" },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.findUnique({
      where: { qrId },
      select: {
        id: true,
        qrId: true,
        name: true,
        description: true,
        equipmentTag: true,
        state: true,
        isDisabledByAdmin: true,
        approvalStatus: true,
        overWeight: true,
        currentWeight: true,
        equipmentVehicleInfo: {
          select: {
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            registrationExpiration: true,
            mileage: true,
          },
        },
      },
    });

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching equipment data:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch equipment data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
