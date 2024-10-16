import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  console.log("userId", userId);
  // Authenticate the user
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the employee and related contact information
  const employee = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    include: {
      contacts: true,
    },
  });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const { password, signature, permission, accountSetup, ...rest } = employee; // Exclude the password from the response using spread operator

  return NextResponse.json(rest, {
    headers: {
      "Cache-Control":
        "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
