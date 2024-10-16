import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import AddEmployeeContent from "./content";
import { auth } from "@/auth";
import { SearchUser } from "@/lib/types";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    redirect("/signin");
  }
  if (session.user.permission !== "ADMIN" && session.user.permission !== "SUPERADMIN") {
    redirect("/");
  }

  return (
    <Bases>
      <Contents>
        <AddEmployeeContent/>
      </Contents>
    </Bases>
  );
}
