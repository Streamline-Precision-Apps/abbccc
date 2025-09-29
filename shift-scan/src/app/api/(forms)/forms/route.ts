import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic"; // Prevent caching for dynamic data

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create a cached function for fetching forms
  const getCachedForms = unstable_cache(
    async () => {
      return await prisma.formTemplate.findMany({
        select: {
          id: true,
          name: true,
        },
      });
    },
    ["form-templates"],
    {
      tags: ["forms", "form-templates"],
      revalidate: 1800, // Cache for 30 minutes
    }
  );

  const forms = await getCachedForms();

  return NextResponse.json(forms);
}
