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

    let users, total, pageSize, page, skip, totalPages;

    if (status === "inactive") {
      page = undefined;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      users = await prisma.user.findMany({
        where: {
          terminationDate: {
            not: null,
          },
          ...(search
            ? {
                OR: [
                  { username: { contains: search, mode: "insensitive" } },
                  { firstName: { contains: search, mode: "insensitive" } },
                  { middleName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { secondLastName: { contains: search, mode: "insensitive" } },
                  {
                    Contact: {
                      phoneNumber: { contains: search, mode: "insensitive" },
                    },
                  },
                ],
              }
            : {}),
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          middleName: true,
          lastName: true,
          secondLastName: true,
          image: true,
          email: true,
          DOB: true,
          terminationDate: true,
          accountSetup: true,
          permission: true,
          truckView: true,
          tascoView: true,
          mechanicView: true,
          laborView: true,
          Contact: {
            select: {
              phoneNumber: true,
              emergencyContact: true,
              emergencyContactNumber: true,
            },
          },
        },
        orderBy: {
          lastName: "asc",
        },
      });
      total = users.length;
    } else {
      page = parseInt(searchParams.get("page") || "1", 10);
      pageSize = parseInt(searchParams.get("pageSize") || "25", 10);
      skip = (page - 1) * pageSize;
      // Count for pagination
      total = await prisma.user.count({
        where: {
          terminationDate: null,
          ...(search
            ? {
                OR: [
                  { username: { contains: search, mode: "insensitive" } },
                  { firstName: { contains: search, mode: "insensitive" } },
                  { middleName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { secondLastName: { contains: search, mode: "insensitive" } },
                  {
                    Contact: {
                      phoneNumber: { contains: search, mode: "insensitive" },
                    },
                  },
                ],
              }
            : {}),
        },
      });
      totalPages = Math.ceil(total / pageSize);
      users = await prisma.user.findMany({
        where: {
          terminationDate: null,
          ...(search
            ? {
                OR: [
                  { username: { contains: search, mode: "insensitive" } },
                  { firstName: { contains: search, mode: "insensitive" } },
                  { middleName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { secondLastName: { contains: search, mode: "insensitive" } },
                  {
                    Contact: {
                      phoneNumber: { contains: search, mode: "insensitive" },
                    },
                  },
                ],
              }
            : {}),
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          middleName: true,
          lastName: true,
          secondLastName: true,
          image: true,
          email: true,
          DOB: true,
          terminationDate: true,
          accountSetup: true,
          permission: true,
          truckView: true,
          tascoView: true,
          mechanicView: true,
          laborView: true,
          Contact: {
            select: {
              phoneNumber: true,
              emergencyContact: true,
              emergencyContactNumber: true,
            },
          },
        },
        orderBy: {
          lastName: "asc",
        },
        skip,
        take: pageSize,
      });
    }

    return NextResponse.json({
      users,
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
