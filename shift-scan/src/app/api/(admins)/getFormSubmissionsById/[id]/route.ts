import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FormStatus } from "@/lib/enums";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const dateRangeStart = searchParams.get("startDate");
  const dateRangeEnd = searchParams.get("endDate");

  const statusFilterRaw = searchParams.get("statusFilter") || "ALL";
  const validStatuses: FormStatus[] = Object.values(FormStatus);

  const shouldFilter =
    statusFilterRaw !== "ALL" &&
    validStatuses.includes(statusFilterRaw as FormStatus);
  const statusFilter = shouldFilter
    ? (statusFilterRaw as FormStatus)
    : undefined;

  try {
    const total = await prisma.formSubmission.count({
      where: {
        formTemplateId: id,
        ...(statusFilter && { status: statusFilter }),
        ...(!statusFilter && { status: { not: "DRAFT" } }),
        ...(statusFilter === "DRAFT" && { status: "DRAFT" }),
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
        ...(statusFilter && { status: statusFilter }),
        ...(!statusFilter && { status: { not: "DRAFT" } }),
        ...(statusFilter === "DRAFT" && { status: "DRAFT" }),
        ...(dateRangeStart || dateRangeEnd
          ? {
              submittedAt: {
                ...(dateRangeStart && { gte: new Date(dateRangeStart) }),
                ...(dateRangeEnd && { lte: new Date(dateRangeEnd) }),
              },
            }
          : {}),
      },
      skip,
      take,
      orderBy: { submittedAt: "desc" },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...formTemplate,
      Submissions: submissions,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching form template:", error);
    return NextResponse.json(
      { error: "Failed to fetch form template" },
      { status: 500 },
    );
  }
}
