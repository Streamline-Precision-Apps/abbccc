import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

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
      userId,
      status: FormStatus.DRAFT,
    },

    select: {
      data: true,
      title: true,
      FormTemplate: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json(forms);
}
