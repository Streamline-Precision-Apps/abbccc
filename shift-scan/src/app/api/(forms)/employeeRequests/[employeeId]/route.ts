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
    const requests = await prisma.formSubmission.findMany({
      where: {
        status: "PENDING",
        userId: employeeId,
        user: {
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
      },
    });

    revalidateTag("requests");
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching employee requests:", error);
    return NextResponse.json(
      { error: "Error fetching employee requests" },
      { status: 500 }
    );
  }
}
