"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;
  const forms = await prisma.formSubmission.findUnique({
    where: {
      id,
      status: { not: FormStatus.DRAFT },
    },
    include: {
      user: {
        select: {
          signature: true,
        },
      },
      approvals: {
        select: {
          id: true,
          comment: true,
          updatedAt: true,
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

  return NextResponse.json(forms);
}
