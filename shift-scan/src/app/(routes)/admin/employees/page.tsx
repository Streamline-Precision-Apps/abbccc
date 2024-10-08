import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import AddEmployeeContent from "./content";
import { auth } from "@/auth";
import { SearchUser } from "@/lib/types";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";

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
      terminationDate: true
    },
  });

  return (
    <Bases>
      <Contents>
        <AddEmployeeContent permission={User?.permission} users={users} />
      </Contents>
    </Bases>
  );
}
