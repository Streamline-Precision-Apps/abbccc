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
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const forms = await prisma.formSubmission.findUnique({
    where: {
      id,
    },
    include: {
      User: {
        select: {
          signature: true,
        },
      },
      Approvals: {
        select: {
          id: true,
          comment: true,
          updatedAt: true,
          Approver: {
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
