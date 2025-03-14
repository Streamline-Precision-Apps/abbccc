"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { SearchUser } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const filter = url.searchParams.get("filter");

    let employees: SearchUser[] = [];

    if (filter === "inactive") {
      employees = await prisma.user.findMany({
        where: { terminationDate: { not: null } },
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
      employees = await prisma.user.findMany({
        where: { terminationDate: null },
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
      employees = await prisma.user.findMany({
        where: { laborView: true },
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
      employees = await prisma.user.findMany({
        where: { truckView: true },
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
      employees = await prisma.user.findMany({
        where: { tascoView: true },
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
      employees = await prisma.user.findMany({
        where: { mechanicView: true },
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
      employees = await prisma.user.findMany({
        where: { permission: "MANAGER" },
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
      employees = await prisma.user.findMany({
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
      employees = employees.filter((employee) => employee.permission !== "USER");
    } else if (filter === "admins") {
      employees = await prisma.user.findMany({
        where: { permission: "ADMIN" },
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
      employees = await prisma.user.findMany({
        where: { permission: "SUPERADMIN" },
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
      employees = await prisma.user.findMany({
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
        orderBy: { startDate: "desc" },
      });
    } else {
      employees = await prisma.user.findMany({
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

    if (!employees || employees.length === 0) {
      return NextResponse.json(
        { message: "No employees found for the given filter." },
        { status: 404 }
      );
    }

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching profile data:", error);

    let errorMessage = "Failed to fetch profile data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}



// "use server";
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { auth } from "@/auth";
// import { SearchUser } from "@/lib/types";

// export async function GET(req: Request) {
//   try {
//     const session = await auth();
//     const userId = session?.user?.id;

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const url = new URL(req.url);
//     const filter = url.searchParams.get("filter");

//     const commonSelect = {
//       id: true,
//       firstName: true,
//       lastName: true,
//       username: true,
//       permission: true,
//       DOB: true,
//       truckView: true,
//       mechanicView: true,
//       laborView: true,
//       tascoView: true,
//       image: true,
//       terminationDate: true,
//     };

//     let whereClause = {};

//     switch (filter) {
//       case "inactive":
//         whereClause = { terminationDate: { not: null } };
//         break;
//       case "active":
//         whereClause = { terminationDate: null };
//         break;
//       case "laborers":
//         whereClause = { laborView: true };
//         break;
//       case "truckers":
//         whereClause = { truckView: true };
//         break;
//       case "tasco":
//         whereClause = { tascoView: true };
//         break;
//       case "mechanics":
//         whereClause = { mechanicView: true };
//         break;
//       case "managers":
//         whereClause = { permission: "MANAGER" };
//         break;
//       case "supervisors":
//         whereClause = { permission: { not: "USER" } };
//         break;
//       case "admins":
//         whereClause = { permission: "ADMIN" };
//         break;
//       case "superAdmins":
//         whereClause = { permission: "SUPERADMIN" };
//         break;
//       case "recentlyHired":
//         return NextResponse.json(
//           await prisma.user.findMany({
//             select: commonSelect,
//             orderBy: { startDate: "desc" },
//           })
//         );
//       default:
//         break;
//     }

//     const employees = await prisma.user.findMany({
//       where: whereClause,
//       select: commonSelect,
//     });

//     if (!employees || employees.length === 0) {
//       return NextResponse.json(
//         { message: "No employees found for the given filter." },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(employees);
//   } catch (error) {
//     console.error("Error fetching profile data:", error);

//     let errorMessage = "Failed to fetch profile data";
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }

//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }


