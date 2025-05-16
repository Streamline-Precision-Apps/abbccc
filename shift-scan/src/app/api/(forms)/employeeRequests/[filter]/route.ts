// this Api is used to fetch employee requests by employee id for the manager, there will be a way to filter the request by team
"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { filter: string } }
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

  const { filter } = params;
  const { searchParams } = new URL(req.url);
  const skip = parseInt(searchParams.get("skip") || "0");
  const take = parseInt(searchParams.get("take") || "10");

  try {
    if (filter === "all") {
      const requests = await prisma.formSubmission.findMany({
        where: {
          status: "PENDING",
          User: {
            NOT: {
              // Exclude the current user from the query
              id: userId,
            },
            Crews: {
              some: {
                leadId: userId,
              },
            },
          },
          Approvals: {
            none: {}, // only include requests that have no approvals
          },
        },
        include: {
          FormTemplate: {
            select: {
              formType: true,
            },
          },
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          Approvals: {
            select: {
              signedBy: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log(requests);

      revalidateTag("requests");
      return NextResponse.json(requests);
    } else if (filter === "approved") {
      const requests = await prisma.formSubmission.findMany({
        where: {
          status: { not: { in: ["PENDING", "DRAFT"] } },
          User: {
            NOT: {
              // Exclude the current user from the query
              id: userId,
            },
            Crews: {
              some: {
                leadId: userId,
              },
            },
          },
        },

        include: {
          FormTemplate: {
            select: {
              formType: true,
            },
          },
          User: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          Approvals: {
            select: {
              id: true,
              Approver: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log(requests);

      revalidateTag("requests");
      return NextResponse.json(requests);
    } else {
      const requests = await prisma.formSubmission.findMany({
        where: {
          status: "PENDING",
          userId: filter,
          User: {
            NOT: {
              // Exclude the current user from the query
              id: userId,
            },
            Crews: {
              some: {
                leadId: userId,
              },
            },
          },
          Approvals: {
            none: {}, // only include requests that have no approvals
          },
        },
        include: {
          FormTemplate: {
            select: {
              formType: true,
            },
          },
          User: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          Approvals: {
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
