"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the ID parameter
    if (!params.id) {
      return NextResponse.json({ error: "Missing cost code ID" }, { status: 400 });
    }

    // Fetch cost code data
    const costcodeData = await prisma.costCode.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!costcodeData) {
      return NextResponse.json(
        { error: "Cost code not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(costcodeData);
  } catch (error) {
    console.error("Error fetching cost code data:", error);

    let errorMessage = "Failed to fetch cost code data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
