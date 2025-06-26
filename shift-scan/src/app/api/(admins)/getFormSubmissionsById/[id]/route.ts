import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Query the database for the complete form template data with full relationships
    const formTemplate = await prisma.formTemplate.findUnique({
      where: {
        id: String(id), // Ensure that the id is a string
      },
      include: {
        FormGrouping: {
          select: {
            id: true,
            title: true,
            order: true,
            Fields: {
              select: {
                label: true,
                name: true,
                type: true,
                required: true,
                order: true,
                defaultValue: true,
                placeholder: true,
                maxLength: true,
                helperText: true,
                Options: true,
              },
            },
          },
        },
        Submissions: {
          include: {
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(formTemplate);
  } catch (error) {
    // Log any database errors
    console.error("Error fetching form template:", error);
    return NextResponse.json(
      { error: "Failed to fetch form template" },
      { status: 500 }
    );
  }
}
