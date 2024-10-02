"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Inputs } from "@/components/(reusable)/inputs";
import { getTranslations } from "next-intl/server";
import { Labels } from "@/components/(reusable)/labels";
import ChangePassword from "@/app/hamburger/changePassword/changepassword";
import { auth } from "@/auth";

export default async function Index() {
  const session = await auth();
  if (!session) return null;
  const userId = session.user.id;
  const t = await getTranslations("Hamburger");

  return (
    <Bases>
      <Contents>
        <Grids size={"settings"}>
          <Holds
            background={"white"}
            size={"full"}
            className="row-span-2 p-4 h-full"
          >
            <TitleBoxes
              title="Change Password"
              titleImg="/settings.svg"
              titleImgAlt="Change Password Icon"
            />
          </Holds>
          <ChangePassword userId={userId} />
        </Grids>
      </Contents>
    </Bases>
  );
}
