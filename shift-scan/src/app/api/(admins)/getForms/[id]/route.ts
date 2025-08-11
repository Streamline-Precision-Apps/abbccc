import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

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

    // Validate form ID
    const formId = (await params).id;
    if (!formId) {
      return NextResponse.json(
        { error: "Invalid or missing form ID" },
        { status: 400 }
      );
    }

    // Fetch the form template with related groupings and fields
    const formTemplate = await prisma.formTemplate.findUnique({
      where: { id: formId },
      include: {
        FormGrouping: {
          include: {
            Fields: {
              orderBy: { order: "asc" },
              include: {
                Options: {
                  select: {
                    id: true,
                    value: true,
                  },
                }, // Include FormFieldOption[]
              },
            },
          },
          orderBy: { order: "asc" }, // optional: keep groupings ordered
        },
      },
    });

    // Check if formTemplate exists
    if (!formTemplate) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(formTemplate);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching form:", error);

    let errorMessage = "Failed to fetch form data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
