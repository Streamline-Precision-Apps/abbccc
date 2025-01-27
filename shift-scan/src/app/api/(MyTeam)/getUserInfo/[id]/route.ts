"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest } from "next/server";
type Params = Promise<{ id: string }>;
// Corrected GET function
export async function GET(req: NextRequest, { params }: { params: Params }) {
  console.log(req);
  const userId = (await params).id;
  console.log("userId", userId);

  // Authenticate the user
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the employee and related contact information
  const employee = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      DOB: true,
      image: true,
      contact: {
        select: {
          phoneNumber: true,
          emergencyContact: true,
          emergencyContactNumber: true,
        },
      },
      // Exclude fields like password, signature, etc.
      // We select only the fields that are needed
    },
  });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const contact = employee.contact;
  const employeeData = {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    DOB: employee.DOB,
    image: employee.image,
  };
  const data = { employeeData, contact };
  // Exclude sensitive fields

  return NextResponse.json(data, {
    headers: {
      "Cache-Control":
        "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
