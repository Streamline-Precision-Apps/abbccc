// only managers can view the team submission in the api and user must be signed in
"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = session?.user.id;
  const permission = session?.user.permission;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (permission === "USER") {
    return NextResponse.json(
      { error: "Unauthorized User Permission" },
      { status: 401 }
    );
  }
  const { id } = params;
  try {
    const formSubmission = await prisma.formSubmission.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(formSubmission);
  } catch {
    console.error("error getting Form Submission");
    return NextResponse.json({ error: "error getting Form Submission" });
  }
}
