import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formTemplate = await prisma.formTemplate.findUnique({
    where: {
      id,
    },
    include: {
      FormGrouping: {
        include: {
          Fields: {
            include: {
              Options: true, // Include dropdown options if any
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
      title: group.title || "",
      order: group.order,
      fields: group.Fields.map((field) => ({
        id: field.id,
        label: field.label,
        name: field.id, // Use field.id as the name since FormField doesn't have a name property
        type: field.type,
        required: field.required,
        order: field.order,
        defaultValue: undefined, // FormField doesn't have defaultValue
        placeholder: field.placeholder,
        helperText: field.content, // Use content as helperText
        filter: field.filter, // Include the filter property for SEARCH_ASSET fields
        multiple: field.multiple, // Include multiple property for multi-select fields
        options: field.Options.map((option) => option.value), // Extract dropdown options
      })),
    })),
  };

  return NextResponse.json(formattedForm);
}
