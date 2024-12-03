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
    } else if (filter === "laborers") {
      employees = await prisma.users.findMany({
        where: {
          laborView: true,
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
    } else if (filter === "truckers") {
      employees = await prisma.users.findMany({
        where: {
          truckView: true,
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
    } else if (filter === "tasco") {
      employees = await prisma.users.findMany({
        where: {
          tascoView: true,
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
    } else if (filter === "mechanics") {
      employees = await prisma.users.findMany({
        where: {
          mechanicView: true,
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
    } else if (filter === "managers") {
      employees = await prisma.users.findMany({
        where: {
          permission: "MANAGER",
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
    } else if (filter === "supervisors") {
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
      employees = employees.filter(
        (employee) => employee.permission !== "USER"
      );
    } else if (filter === "admins") {
      employees = await prisma.users.findMany({
        where: {
          permission: "ADMIN",
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
    } else if (filter === "superAdmins") {
      employees = await prisma.users.findMany({
        where: {
          permission: "SUPERADMIN",
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
    } else if (filter === "recentlyHired") {
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
        orderBy: {
          startDate: "desc",
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
