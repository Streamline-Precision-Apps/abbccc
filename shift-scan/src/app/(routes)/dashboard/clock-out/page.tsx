import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import ClockOutContent from "./clockOutContent";

export default async function AdminDashboard() {
    const session = await auth().catch((err) => {
        console.error("Error in authentication:", err);
        return null;
      });
  const userId = session?.user.id;

  const user = await prisma.user.findUnique({
    where: {
        id: userId,
      },
      select: {
        Signature: true,
      },
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      return null;
    });


  return <ClockOutContent id={userId ?? ""} signature={user?.Signature ?? null} />;
}
