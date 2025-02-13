import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import MechanicDisplay from "./components/MechanicDisplay";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Mechanic() {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const permission = session.user.permission;
  const isManager = ["ADMIN", "SUPERADMIN", "MANAGER"].includes(permission);

  return (
    <Bases>
      <Contents>
        <MechanicDisplay isManager={isManager} />
      </Contents>
    </Bases>
  );
}
