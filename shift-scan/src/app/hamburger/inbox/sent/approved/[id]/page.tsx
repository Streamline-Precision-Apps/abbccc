"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Content from "@/app/hamburger/inbox/sent/approved/[id]/content";
type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const session = await auth();
  const userId = session?.user.id;

  const sentContent = await prisma.timeoffRequestForms.findMany({
    where: {
      id: Number((await params).id),
      employeeId: userId,
    },
  });

  return (
    <>
      <Content
        sentContent={sentContent}
        session={session}
        params={await params}
      />
    </>
  );
}
