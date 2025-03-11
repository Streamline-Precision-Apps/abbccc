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

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formTemplate = await prisma.formTemplate.findUnique({
    where: {
      id: params.id,
    },
    include: {
      FormGrouping: {
        include: {
          fields: {
            include: {
              options: true, // Include dropdown options if any
            },
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!formTemplate) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  // Format the response
  const formattedForm = {
    id: formTemplate.id,
    name: formTemplate.name,
    formType: formTemplate.formType,
    isActive: formTemplate.isActive,
    isSignatureRequired: formTemplate.isSignatureRequired,
    groupings: formTemplate.FormGrouping.map((group) => ({
      id: group.id,
      title: group.title || "Untitled Group",
      order: group.order,
      fields: group.fields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        order: field.order,
        defaultValue: field.defaultValue,
        placeholder: field.placeholder,
        helperText: field.helperText,
        options: field.options.map((option) => option.value), // Extract dropdown options
      })),
    })),
  };

  return NextResponse.json(formattedForm);
}
