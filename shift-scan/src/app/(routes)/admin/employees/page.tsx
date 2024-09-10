import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import AddEmployeeContent from "./content";
import { auth } from "@/auth";
import { SearchUser } from "@/lib/types";

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

  const users: SearchUser[] = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      permission: true,
      DOB: true,
      truck_view: true,
      mechanic_view: true,
      labor_view: true,
      tasco_view: true,
      email: true,
      phone: true,
      image: true,
    },
  });

  return <AddEmployeeContent permission={User?.permission} users={users} />;
}
