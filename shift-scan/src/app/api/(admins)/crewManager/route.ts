import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query params for pagination
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search")?.trim() || "";

    let crews, total, pageSize, page, skip, totalPages;

    // Build search filter for crew name, supervisor (lead user), or any user in the crew
    const userSearchFilter = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            {
              Users: {
                some: {
                  OR: [
                    {
                      firstName: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      middleName: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      lastName: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      secondLastName: {
                        contains: search,
                        mode: "insensitive" as const,
                      },
                    },
                  ],
                },
              },
            },
            // If you have a relation for the lead user, update the relation name below (e.g., 'Lead' or 'leadUser')
          ],
        }
      : {};

    if (status === "inactive") {
      page = undefined;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      crews = await prisma.crew.findMany({
        where: {
          ...userSearchFilter,
        },
        select: {
          id: true,
          name: true,
          leadId: true,
          crewType: true,
          createdAt: true,
          Users: {
            select: {
              id: true,
              firstName: true,
              middleName: true,
              lastName: true,
              secondLastName: true,
              image: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        skip,
        take: pageSize,
      });

      total = crews.length;
    } else {
      page = parseInt(searchParams.get("page") || "1", 10);
      pageSize = parseInt(searchParams.get("pageSize") || "25", 10);
      skip = (page - 1) * pageSize;
      // Count for pagination
      total = await prisma.crew.count({
        where: {
          ...userSearchFilter,
        },
      });
      totalPages = Math.ceil(total / pageSize);
      crews = await prisma.crew.findMany({
        where: {
          ...userSearchFilter,
        },
        select: {
          id: true,
          name: true,
          leadId: true,
          crewType: true,
          createdAt: true,
          Users: {
            select: {
              id: true,
              firstName: true,
              middleName: true,
              lastName: true,
              secondLastName: true,
              image: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        skip,
        take: pageSize,
      });
    }

    return NextResponse.json({
      crews,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching user summary:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch jobsite summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
