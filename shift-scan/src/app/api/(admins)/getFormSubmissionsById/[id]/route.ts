import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FormStatus } from "../../../../../../prisma/generated/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "25", 10);

  // pendingOnly and statusFilter are needed before skip/take
  const pendingOnly = searchParams.get("pendingOnly") === "true";
  const statusFilter = searchParams.get("statusFilter") || "ALL";

  // If pendingOnly, do not paginate (return all pending submissions)
  const skip = pendingOnly ? undefined : (page - 1) * pageSize;
  const take = pendingOnly ? undefined : pageSize;

  const dateRangeStart = searchParams.get("startDate");
  const dateRangeEnd = searchParams.get("endDate");

  // (moved up)

  // Determine the status condition for queries
  let statusCondition: FormStatus | undefined;
  if (pendingOnly) {
    statusCondition = "PENDING";
  } else if (statusFilter && statusFilter !== "ALL") {
    statusCondition = statusFilter as FormStatus;
  }

  try {
    const total = await prisma.formSubmission.count({
      where: {
        formTemplateId: id,
        NOT: {
          status: "DRAFT",
        },
        ...(statusCondition && { status: statusCondition }),
      },
    });

    // Count of pending submissions for inbox
    const pendingForms = await prisma.formSubmission.count({
      where: {
        formTemplateId: id,
        status: "PENDING",
      },
    });

    const formTemplate = await prisma.formTemplate.findUnique({
      where: { id },
      include: {
        FormGrouping: {
          select: {
            id: true,
            title: true,
            order: true,
            Fields: {
              select: {
                id: true,
                label: true,
                type: true,
                required: true,
                order: true,
                placeholder: true,
                minLength: true,
                maxLength: true,
                multiple: true,
                content: true,
                filter: true,
                Options: true,
              },
            },
          },
        },
      },
    });

    if (!formTemplate) {
      return NextResponse.json(
        { error: "Form template not found" },
        { status: 404 },
      );
    }

    const submissions = await prisma.formSubmission.findMany({
      where: {
        formTemplateId: id,
        NOT: {
          status: "DRAFT",
        },
        ...(statusCondition && { status: statusCondition }),
        ...(dateRangeStart || dateRangeEnd
          ? {
              submittedAt: {
                ...(dateRangeStart && { gte: new Date(dateRangeStart) }),
                ...(dateRangeEnd && { lte: new Date(dateRangeEnd) }),
              },
            }
          : {}),
      },
      ...(skip !== undefined ? { skip } : {}),
      ...(take !== undefined ? { take } : {}),
      orderBy: { submittedAt: "desc" },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            signature: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...formTemplate,
      Submissions: submissions,
      total,
      page: pendingOnly ? 1 : page,
      pageSize: pendingOnly ? submissions.length : pageSize,
      totalPages: pendingOnly ? 1 : Math.ceil(total / pageSize),
      pendingForms,
    });
  } catch (error) {
    console.error("Error fetching form template:", error);
    return NextResponse.json(
      { error: "Failed to fetch form template" },
      { status: 500 },
    );
  }
}
