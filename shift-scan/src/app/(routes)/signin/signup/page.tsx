"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";
import Content from "../../../../components/(signup)/content";


export default async function SignUpPage() {
  const session = await auth();
  const userid = session?.user?.id;

  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en";  
  
  return (
    <Content userId={userid ?? ""} locale={locale} />
  );
}