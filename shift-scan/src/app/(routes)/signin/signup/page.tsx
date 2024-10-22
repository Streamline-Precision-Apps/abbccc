"use server";

import { auth } from "@/auth";
import Content from "@/app/(routes)/signin/signup/(signup)/content";

export default async function SignUpPage() {
  const session = await auth();
  const userid = session?.user?.id;
  const accountSetup = session?.user?.accountSetup;

  return <Content userId={userid ?? ""} accountSetup={accountSetup ?? true} />;
}
