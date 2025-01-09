// Updated API endpoint to fetch crew details by crew ID
"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { crew: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  // Verify user authentication
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const crewId = params.crew;

  // Validate crew ID
  if (!crewId) {
    return NextResponse.json({ error: "Invalid crew ID" }, { status: 400 });
  }

  try {
    // Fetch the crew and its associated users
    const crew = await prisma.crew.findUnique({
      where: { id: crewId },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            permission: true,
          },
        },
      },
    });

    // Handle case where crew is not found
    if (!crew) {
      return NextResponse.json({ error: "Crew not found" }, { status: 404 });
    }

    // Format the response data
    const responseData = {
      crewId: crew.id,
      crewName: crew.name,
      crewDescription: crew.description,
      leadId: crew.leadId,
      users: crew.users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        permission: user.permission,
      })),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching crew data:", error);
    return NextResponse.json(
      { error: "Failed to fetch crew data" },
      { status: 500 }
    );
  }
}
