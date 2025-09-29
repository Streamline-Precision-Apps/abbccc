import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const forms = await prisma.formSubmission.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      FormTemplate: {
        select: {
          id: true,
          name: true,
        },
      },
      User: {
        select: {
          signature: true,
        },
      },
      Approvals: {
        select: {
          id: true,
          comment: true,
          updatedAt: true,
          Approver: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(forms);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { formData, status } = await req.json();

    // Verify the submission exists and belongs to the user
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        {
          error:
            "Form submission not found or you don't have permission to edit it",
        },
        { status: 404 },
      );
    }

    // Ensure status is valid
    if (status && !Object.values(FormStatus).includes(status as FormStatus)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    // Update the submission
    // Note: Update with only the fields that are actually in your Prisma model
    const updatedSubmission = await prisma.formSubmission.update({
      where: {
        id: Number(id),
      },
      data: {
        // Include formData if it's a field in your Prisma model, otherwise use a different field name
        // or consider updating your Prisma schema to include formData
        status: (status as FormStatus) || existingSubmission.status,
        updatedAt: new Date(),
      },
    });

    // Revalidate related cache tags after updating form submission
    revalidateTag("forms");
    revalidateTag("form-submissions");
    revalidateTag(`form-submission-${userId}`);

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Error updating form submission:", error);
    return NextResponse.json(
      { error: "Failed to update form submission" },
      { status: 500 },
    );
  }
}
