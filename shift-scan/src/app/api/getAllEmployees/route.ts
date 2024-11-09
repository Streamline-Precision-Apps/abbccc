"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { SearchUser } from "@/lib/types";

export async function GET(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract the 'filter' parameter from the query string
  const url = new URL(req.url);
  const filter = url.searchParams.get("filter");

  try {
    let employees: SearchUser[] = [];

    if (filter === "inactive") {
      employees = await prisma.users.findMany({
        where: {
          terminationDate: { not: null },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          permission: true,
          DOB: true,
          truckView: true,
          mechanicView: true,
          laborView: true,
          tascoView: true,
          image: true,
          terminationDate: true,
        },
      });
    } else if (filter === "active") {
      employees = await prisma.users.findMany({
        where: {
          terminationDate: null,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          permission: true,
          DOB: true,
          truckView: true,
          mechanicView: true,
          laborView: true,
          tascoView: true,
          image: true,
          terminationDate: true,
        },
      });
    } else {
      employees = await prisma.users.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          permission: true,
          DOB: true,
          truckView: true,
          mechanicView: true,
          laborView: true,
          tascoView: true,
          image: true,
          terminationDate: true,
        },
      });
    }

    // Return the fetched data as a response
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
