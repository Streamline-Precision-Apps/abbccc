import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  // Parse pagination params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    // Get total count of submissions for this form
    const total = await prisma.formSubmission.count({
      where: { formTemplateId: String(id) },
    });

    // Query the database for the form template (without submissions)
    const formTemplate = await prisma.formTemplate.findUnique({
      where: {
        id: String(id),
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
                type: true,
                required: true,
                order: true,
                placeholder: true,
                maxLength: true,
                Options: true,
              },
            },
          },
        },
      },
    });

    // Fetch paginated submissions
    const submissions = await prisma.formSubmission.findMany({
      where: { formTemplateId: String(id) },
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
    // Log any database errors
    console.error("Error fetching form template:", error);
    return NextResponse.json(
      { error: "Failed to fetch form template" },
      { status: 500 }
    );
  }
}
