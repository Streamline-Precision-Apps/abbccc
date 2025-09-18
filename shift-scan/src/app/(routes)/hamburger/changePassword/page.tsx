"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import ChangePassword from "@/app/(routes)/hamburger/changePassword/changepassword";
import { auth } from "@/auth";

export default async function Index() {
  const session = await auth();
  if (!session) return null;
  const userId = session.user.id;

  return (
    <Bases>
      <ChangePassword userId={userId} />
    </Bases>
  );
}
