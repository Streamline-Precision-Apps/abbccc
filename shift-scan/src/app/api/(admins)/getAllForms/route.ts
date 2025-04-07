"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const forms = await prisma.formTemplate.findMany({
      select: {
        id: true,
        name: true,
        FormGrouping: {
          include: {
            Fields: {
              include: {
                Options: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    if (!forms || forms.length === 0) {
      return NextResponse.json(
        { message: "No forms found" },
        { status: 404 }
      );
    }

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching form templates:", error);

    let errorMessage = "Failed to fetch form templates";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
