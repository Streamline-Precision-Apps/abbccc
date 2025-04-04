import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate form ID
    const formId = params.id;
    if (!formId) {
      return NextResponse.json({ error: "Invalid or missing form ID" }, { status: 400 });
    }

    // Fetch the form template with related groupings and fields
    const formTemplate = await prisma.formTemplate.findUnique({
      where: { id: formId },
      include: {
        FormGrouping: {
          include: {
            fields: { orderBy: { order: "asc" } }, // Load fields sorted by `order`
          },
        },
      },
    });

    // Check if formTemplate exists
    if (!formTemplate) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(formTemplate);
  } catch (error) {
    console.error("Error fetching form:", error);

    let errorMessage = "Failed to fetch form data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
