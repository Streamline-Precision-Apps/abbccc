"use server";
import { Bases } from "@/components/(reusable)/bases";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfilePage from "./accountSettings";

export default async function EmployeeProfile() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  const userId = session.user.id;
  return (
    <Bases>
      <ProfilePage userId={userId} />
    </Bases>
  );
}
