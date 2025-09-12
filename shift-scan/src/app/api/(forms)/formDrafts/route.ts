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

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const forms = await prisma.formSubmission.findMany({
    where: {
      userId,
      status: FormStatus.DRAFT,
    },
    include: {
      FormTemplate: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json(forms);
}
