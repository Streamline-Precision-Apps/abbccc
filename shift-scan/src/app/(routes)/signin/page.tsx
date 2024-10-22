"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import Password from "./password";
import { Holds } from "@/components/(reusable)/holds";
import { getTranslations } from "next-intl/server";

export default async function SignInPage() {
  const t = await getTranslations("Login");
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
          <Password />
        </Holds>
      </Contents>
    </Bases>
  );
}
