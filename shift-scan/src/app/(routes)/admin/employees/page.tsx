import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import AddEmployeeContent from "./content";
import { auth } from "@/auth";
import { SearchUser } from "@/lib/types";

export default async function AdminDashboard() {
  const session = await auth();
  const userId = session?.user.id;

  const User = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      permission: true,
    },
  });

  const users: SearchUser[] = await prisma.users.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      permission: true,
      DOB: true,
      truckView: true,
      mechanicView: true,
      laborView: true,
      tascoView: true,
      image: true,
    },
  });

  return <AddEmployeeContent permission={User?.permission} users={users} />;
}
