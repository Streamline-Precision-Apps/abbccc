import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import AdminContent from "./adminContent";
import { auth } from "@/auth";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export default async function AdminDashboard() {
  const session = await auth();
  const userid = session?.user.id;

  const User = await prisma.user.findUnique({
    where: {
      id: userid,
    },
    select: {
      permission: true,
    },
  });
  if (User?.permission !== "ADMIN" && User?.permission !== "SUPERADMIN") {
    console.log("redirecting" + User?.permission);
    return NextResponse.redirect("/dashboard", {});
  }
  return <AdminContent permission={User?.permission} />;
}
