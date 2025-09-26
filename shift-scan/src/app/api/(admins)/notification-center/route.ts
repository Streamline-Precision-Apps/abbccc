import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { se } from "date-fns/locale";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get summary information of all equipment (just id and name)
 * Used for lightweight equipment listing in admin assets page
 */
export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        Response: {
          is: null,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const count = await prisma.notification.count();

    const resolved = await prisma.notification.findMany({
      where: {
        Response: {
          isNot: null,
        },
      },
      include: {
        Response: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        Reads: {
          select: { userId: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const unreadCount = await prisma.notification.count({
      where: {
        Reads: {
          none: {
            userId: userId,
          },
        },
      },
    });

    return NextResponse.json({
      notifications,
      resolved,
      count,
      unreadCount,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching equipment summary:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch equipment summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
