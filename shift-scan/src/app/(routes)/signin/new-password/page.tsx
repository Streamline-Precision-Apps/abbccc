"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { getTranslations } from "next-intl/server";

import ChangePassword from "./changePassword";
import { Grids } from "@/components/(reusable)/grids";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";

export default async function SignInPage() {
  const t = await getTranslations("Login");

  return (
    <Bases>
      <Contents>
        <ChangePassword />
      </Contents>
    </Bases>
  );
}
