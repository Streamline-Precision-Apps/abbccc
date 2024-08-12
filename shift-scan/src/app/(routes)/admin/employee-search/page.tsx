import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import SearchEmployeeContent from "./searchEmployeeContent";
import { SearchUser } from "@/lib/types";


export default async function AdminDashboard() {
  const user = cookies().get("user");
  const userId = user?.value;

  const User = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      permission: true,
    },
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      permission: true,
      DOB: true,
      email: true,
      phone: true,
    }
  }) as SearchUser[];

  return <SearchEmployeeContent permission={User?.permission} SearchUsers={users}/>;
}
