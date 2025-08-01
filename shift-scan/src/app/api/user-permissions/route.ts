"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/user-permissions?userId=...
// Used to fetch a user's saved permissions
export async function GET(request: NextRequest) {
  try {
    // Extract userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Optional: Check if the request is authorized
    // const session = await getServerSession();
    // if (!session || session.user.id !== userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Fetch permissions from database
    const userPermissions = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!userPermissions) {
      return NextResponse.json({ permissions: null }, { status: 404 });
    }

    return NextResponse.json({
      permissions: {
        cameraAccess: userPermissions.cameraAccess,
        locationAccess: userPermissions.locationAccess,
        lastUpdated: userPermissions.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/user-permissions
// Used to update a user's permissions
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { userId, cameraAccess, locationAccess } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Optional: Check if the request is authorized
    // const session = await getServerSession();
    // if (!session || session.user.id !== userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Update or create the user settings
    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        cameraAccess: cameraAccess !== undefined ? cameraAccess : undefined,
        locationAccess:
          locationAccess !== undefined ? locationAccess : undefined,
        lastUpdated: new Date(),
      },
      create: {
        userId,
        cameraAccess: cameraAccess !== undefined ? cameraAccess : false,
        locationAccess: locationAccess !== undefined ? locationAccess : false,
      },
    });

    return NextResponse.json({
      success: true,
      permissions: {
        cameraAccess: updatedSettings.cameraAccess,
        locationAccess: updatedSettings.locationAccess,
        lastUpdated: updatedSettings.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Error updating user permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
