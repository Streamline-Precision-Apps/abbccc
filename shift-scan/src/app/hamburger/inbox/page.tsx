"use server";
import InboxContent from "@/app/hamburger/inbox/_components/inboxContent";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";

export default async function Inbox() {
  const session = await auth();
  if (!session) return null;
  const isManager = session.user.permission !== "USER";

  return (
    <Bases>
      <Contents height={"page"}>
        <Grids rows={"7"} gap={"4"}>
          <InboxContent isManager={isManager} />
        </Grids>
      </Contents>
    </Bases>
  );
}
