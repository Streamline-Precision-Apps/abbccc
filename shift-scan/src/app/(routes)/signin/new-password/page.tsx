"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import { getTranslations } from "next-intl/server";

import ChangePassword from "./changePassword";
import { Grids } from "@/components/(reusable)/grids";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

export default async function SignInPage() {
  const t = await getTranslations("Login");

  return (
    <Bases>
      <Contents>
        <Grids rows={"10"} gap={"5"}>
          <Holds className="row-span-2 h-full">
            <TitleBoxes
              title={t("ChangePassword")}
              titleImg={"/logo.svg"}
              titleImgAlt={`${t("LogoAlt")}`}
              className="mb-5 p-3 bg-white rounded-lg"
              href="/signin"
            />
          </Holds>

          <Holds className="row-span-8 h-full">
            <ChangePassword />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
