"use server";
import { auth } from "@/auth";
import Content from "@/components/(signup)/content";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";

export default async function SignUpPage() {
  const session = await auth();
  const userid = session?.user?.id;
  const accountSetup = session?.user?.accountSetup;

  return (
    <Bases>
      <Contents>
        <Holds className="h-full">
          <Content userId={userid ?? ""} accountSetup={accountSetup ?? true} />
        </Holds>
      </Contents>
    </Bases>
  );
}
