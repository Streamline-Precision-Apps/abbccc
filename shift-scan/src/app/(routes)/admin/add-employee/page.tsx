import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import AddEmployeeContent from "./addEmployeeContent";

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

  return <AddEmployeeContent permission={User?.permission} />;
}
