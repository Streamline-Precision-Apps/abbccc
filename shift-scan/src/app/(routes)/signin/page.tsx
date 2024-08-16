"use server";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { Forms } from "@/components/(reusable)/forms";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import { Images } from "@/components/(reusable)/images";
import Password from "./password";
import { cookies } from "next/headers";

export default async function SignInPage() {
  const locale = cookies().get("locale")?.value || "en";
  return (
    <Bases>
      <Contents variant="default">
        <Contents variant="default" size="logo">
          <Images titleImg="/logo.svg" titleImgAlt="logo" variant="icon" size="default" />
        </Contents>
        <Sections size="dynamic">
          <Contents variant="center" size="default">
              <Password locale={locale} />
          </Contents>
        </Sections>
      </Contents>
    </Bases>
  );
}