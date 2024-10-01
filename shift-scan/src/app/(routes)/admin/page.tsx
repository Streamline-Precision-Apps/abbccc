import prisma from "@/lib/prisma";
import AdminContent from "./adminContent";
import { auth } from "@/auth";
export const dynamic = "force-dynamic";

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

  return <AdminContent permission={User?.permission} />;
}
