import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import ClockOutContent from "./clockOutContent";
import { cookies } from "next/headers";

export default async function AdminDashboard() {

    const lang = cookies().get("locale");
    const locale = lang ? lang.value : "en"; // Default to English

    const session = await auth().catch((err) => {
        console.error("Error in authentication:", err);
        return null;
      });
  const userId = session?.user.id;

  const user = await prisma.users.findUnique({
    where: {
        id: userId,
      },
      select: {
        signature: true,
      },
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      return null;
    });


  return <ClockOutContent id={userId ?? ""} signature={user?.signature ?? null} locale={locale}/>;
}
