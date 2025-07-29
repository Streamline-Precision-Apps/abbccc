import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the ID parameter
    const clientId = (await params).id;
    if (!clientId) {
      return NextResponse.json(
        { error: "Invalid or missing client ID" },
        { status: 400 }
      );
    }

    // Fetch complete client data with all relationships
    const clientData = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        description: true,
        creationReason: true,
        approvalStatus: true,
        contactPerson: true,
        contactEmail: true,
        contactPhone: true,
        createdAt: true,
        updatedAt: true,
        createdById: true,
        createdVia: true,
        Address: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
      },
    });

    if (!clientData) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(clientData);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching client data:", error);

    let errorMessage = "Failed to fetch client data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
