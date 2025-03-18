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
  { params }: { params: { status: string } }
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = params;
  if (status === "all") {
    const forms = await prisma.formSubmission.findMany({
      where: {
        userId,
        status: { not: FormStatus.DRAFT },
      },
      include: {
        formTemplate: {
          select: {
            name: true,
            formType: true,
          },
        },
      },
    });

    return NextResponse.json(forms);
  } else if (status === "pending") {
    const forms = await prisma.formSubmission.findMany({
      where: {
        userId,
        status: FormStatus.PENDING,
      },
      include: {
        formTemplate: {
          select: {
            name: true,
            formType: true,
          },
        },
      },
    });

    return NextResponse.json(forms);
  } else if (status === "approved") {
    const forms = await prisma.formSubmission.findMany({
      where: {
        userId,
        status: FormStatus.APPROVED,
      },
      include: {
        formTemplate: {
          select: {
            name: true,
            formType: true,
          },
        },
      },
    });

    return NextResponse.json(forms);
  } else if (status === "denied") {
    const forms = await prisma.formSubmission.findMany({
      where: {
        userId,
        status: FormStatus.DENIED,
      },
      include: {
        formTemplate: {
          select: {
            name: true,
            formType: true,
          },
        },
      },
    });

    return NextResponse.json(forms);
  }
}
