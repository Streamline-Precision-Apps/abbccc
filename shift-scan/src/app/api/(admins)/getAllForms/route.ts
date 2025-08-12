import { NextResponse } from "next/server";
// Sentry import already present if needed
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

/**
 * GET /api/getAllForms
 * Supports pagination via query params: ?page=1&pageSize=10
 */
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse pagination params
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    let forms, total, pageSize, page, skip, totalPages;
    if (search !== "") {
      page = undefined;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      forms = await prisma.formTemplate.findMany({
        include: {
          _count: {
            select: {
              Submissions: true,
            },
          },
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
        orderBy: {
          createdAt: "desc",
        },
      });
      total = forms.length;
    } else {
      page = parseInt(searchParams.get("page") || "1", 10);
      pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
      skip = (page - 1) * pageSize;
      const take = pageSize;
      // Fetch total count for pagination
      total = await prisma.formTemplate.count();
      totalPages = Math.ceil(total / pageSize);
      // Get total count for pagination

      forms = await prisma.formTemplate.findMany({
        skip,
        take,
        include: {
          _count: {
            select: {
              Submissions: true,
            },
          },
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
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json({
      data: forms,
      page,
      pageSize,
      total,
      totalPages,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching form templates:", error);
    let errorMessage = "Failed to fetch form templates";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
