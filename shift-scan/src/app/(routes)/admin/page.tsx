"use server";
import AdminContent from "./adminContent";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    redirect("/signin");
  }
  if (
    session.user.permission !== "ADMIN" &&
    session.user.permission !== "SUPERADMIN"
  ) {
    redirect("/");
  }

  return <AdminContent />;
}
