"use server";
import { Bases } from "@/components/(reusable)/bases";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfilePage from "./accountSettings";
import { Contents } from "@/components/(reusable)/contents";

export default async function EmployeeProfile() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  const userId = session.user.id;
  return (
    <Bases>
      <Contents>
        <ProfilePage userId={userId} />
      </Contents>
    </Bases>
  );
}
