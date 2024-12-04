"use server";
import { auth } from "@/auth";
import Content from "@/app/hamburger/inbox/received/[id]/content";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
type Params = Promise<{ id: string }>;
export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const session = await auth();
  if (!session) return null;

  return (
    <Bases size={"scroll"}>
      <Contents height="page">
        <Content session={session} params={await params} />
      </Contents>
    </Bases>
  );
}
