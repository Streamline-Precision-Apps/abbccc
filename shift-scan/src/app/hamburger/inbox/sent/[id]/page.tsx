"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Content from "@/app/hamburger/inbox/sent/[id]/content";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return null;

  return (
    <Bases size={"scroll"} className="py-5">
      <Contents height="page">
        <Content session={session} params={params} />
      </Contents>
    </Bases>
  );
}
