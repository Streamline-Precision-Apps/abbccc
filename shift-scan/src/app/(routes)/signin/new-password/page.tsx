"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";

import { cookies } from "next/headers";
import { Holds } from "@/components/(reusable)/holds";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";

import ChangePassword from "./changePassword";

export default async function SignInPage() {
  const locale = cookies().get("locale")?.value || "en";
  const t = await getTranslations("login");

  return (
    <Bases>
      <Contents>
        <Images
          titleImg="/logo.svg"
          titleImgAlt={`${t("LogoAlt")}`}
          background="white"
          size="40"
          className="mb-5 p-3"
        />
        <Holds background={"white"}>
          <ChangePassword />
        </Holds>
      </Contents>
    </Bases>
  );
}
