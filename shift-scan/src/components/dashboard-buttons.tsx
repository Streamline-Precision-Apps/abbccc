import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/types";
import { User } from "@/app/(routes)/dashboard/user";
import { Manager } from "@/app/(routes)/dashboard/manager";

export default function DashboardButtons() {
  const t = useTranslations("EmployeeCards");
  const router = useRouter();
  const { data: session } = useSession() as { data: CustomSession | null };
  const user = session?.user;

  if (
    user?.permission === "ADMIN" ||
    user?.permission === "SUPERADMIN" ||
    user?.permission === "MANAGER" ||
    user?.permission === "PROJECTMANAGER"
  ) {
    return (
      <div className="grid grid-cols-2 grid-rows-3 gap-4">
        <Manager />
        <User />
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        <User />
      </div>
    );
  }
}
