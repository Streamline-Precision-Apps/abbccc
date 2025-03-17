// this Api is used to fetch employee requests by employee id for the manager, there will be a way to filter the request by team
"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  const session = await auth();
  const userId = session?.user.id;
  const permission = session?.user.permission;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }
  if (permission === "USER") {
    return NextResponse.json(
      { error: "Unauthorized User Permission" },
      { status: 401 }
    );
  }

  const { employeeId } = params;

  try {
    if (employeeId === "all") {
      const requests = await prisma.formSubmission.findMany({
        where: {
          status: "PENDING",
          user: {
            NOT: {
              // Exclude the current user from the query
              id: userId,
            },
            crews: {
              some: {
                leadId: userId,
              },
            },
          },
          approvals: {
            none: {}, // only include requests that have no approvals
          },
        },
        include: {
          formTemplate: {
            select: {
              formType: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          approvals: {
            select: {
              signedBy: true,
            },
          },
        },
      });
      console.log(requests);

      revalidateTag("requests");
      return NextResponse.json(requests);
    } else if (employeeId === "approved") {
      const requests = await prisma.formSubmission.findMany({
        where: {
          status: { not: { in: ["PENDING", "DRAFT"] } },
          user: {
            NOT: {
              // Exclude the current user from the query
              id: userId,
            },
            crews: {
              some: {
                leadId: userId,
              },
            },
          },
        },
        include: {
          formTemplate: {
            select: {
              formType: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          approvals: {
            select: {
              id: true,
              approver: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
      console.log(requests);

      revalidateTag("requests");
      return NextResponse.json(requests);
    } else {
      const requests = await prisma.formSubmission.findMany({
        where: {
          status: "PENDING",
          userId: employeeId,
          user: {
            NOT: {
              // Exclude the current user from the query
              id: userId,
            },
            crews: {
              some: {
                leadId: userId,
              },
            },
          },
          approvals: {
            none: {}, // only include requests that have no approvals
          },
        },
        include: {
          formTemplate: {
            select: {
              formType: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          approvals: {
            select: {
              signedBy: true,
            },
          },
        },
      });
      console.log(requests);

      revalidateTag("requests");
      return NextResponse.json(requests);
    }
  } catch (error) {
    console.error("Error fetching employee requests:", error);
    return NextResponse.json(
      { error: "Error fetching employee requests" },
      { status: 500 }
    );
  }
}
