"use server";
import { auth } from "@/auth";
import Content from "@/components/(signup)/content";
import { Bases } from "@/components/(reusable)/bases";
import { Header } from "@/components/header";
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
          <Contents width={"section"}>
            <Content
              userId={userid ?? ""}
              accountSetup={accountSetup ?? true}
            />
          </Contents>
        </Holds>
      </Contents>
    </Bases>
  );
}
