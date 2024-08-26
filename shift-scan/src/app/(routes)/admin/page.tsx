import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import AdminContent from "./adminContent";
import { auth } from "@/auth";

export default async function AdminDashboard() {
  const session = await auth();
  const userId = session?.user.id;

  const User = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      permission: true,
    },
  });

  return <AdminContent permission={User?.permission} />;
}
