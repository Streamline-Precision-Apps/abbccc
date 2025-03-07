import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formTemplate = await prisma.formTemplate.findUnique({
      where: { id: params.id },
      include: {
        FormGrouping: {
          include: {
            fields: { orderBy: { order: "asc" } }, // Load fields sorted by `order`
          },
        },
      },
    });

    if (!formTemplate)
      return NextResponse.json({ error: "Form not found" }, { status: 404 });

    return NextResponse.json(formTemplate);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching form" }, { status: 500 });
  }
}
