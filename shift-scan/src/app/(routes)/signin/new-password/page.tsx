"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import { getTranslations } from "next-intl/server";

import ChangePassword from "./changePassword";

export default async function SignInPage() {
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
