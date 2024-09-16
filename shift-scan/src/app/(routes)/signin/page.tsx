"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import { Images } from "@/components/(reusable)/images";
import Password from "./password";
import { cookies } from "next/headers";

export default async function SignInPage() {
  const locale = cookies().get("locale")?.value || "en";
  return (
    <Bases variant="center">
      <Contents variant="default" size="test">
        <Images titleImg="/logo.svg" titleImgAlt="logo" variant="icon" size="default" />
        <Sections size="dynamic">
              <Password locale={locale} />
        </Sections>
      </Contents>
    </Bases>
  );
}