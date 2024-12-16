"use client";
import React from "react";
import { Images } from "../(reusable)/images";
import { Buttons } from "../(reusable)/buttons";
import { Texts } from "../(reusable)/texts";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { Contents } from "../(reusable)/contents";
import { Checkbox } from "../(inputs)/checkBox";
import { ChangeEvent} from "react";
import { setLocale } from "@/actions/cookieActions";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const ShiftScanIntro = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const router = useRouter();
  const t = useTranslations("SignUpIntro");
  const LocaleHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    await setLocale(event.target.checked);
    router.refresh();
  };
  return (
    <Grids rows={"10"} gap={"5"} className="h-full mb-5">
      <Holds background={"white"} className="row-span-3 h-full">
        <Images
          titleImg={"/shiftScanLogo.svg"}
          titleImgAlt={t("LogoAlt")}
          size={"30"}
          background={"white"}
        />
        <Contents width={"section"}>
          <Holds className="my-auto">
            <Texts size={"p3"}>{t("Welcome")}</Texts>
          </Holds>
        </Contents>
      </Holds>
      <Holds background={"white"} className="row-span-6 h-full">
        <Contents width={"section"} className="my-5 justify-between">
          <Titles size={"h2"} className="my-auto">{t("ThingsWeNeedToDo")}</Titles>
          <Holds position={"row"}>
            <Holds size={"80"}>
              <Texts size={"p3"} position={"left"} className="my-5">{t("ChooseNewPassword")}</Texts>
            </Holds>
            <Holds size={"20"}>
              <Checkbox
              id={"1"}
              label={" "}
              onChange={(e: ChangeEvent<HTMLInputElement>) => LocaleHandler(e)}
              name="locale"/>
            </Holds>
          </Holds>
          <Holds position={"row"}>
            <Holds size={"80"}>
              <Texts size={"p3"} position={"left"} className="my-5">{t("GivePermissions")}</Texts>
            </Holds>
            <Holds size={"20"}>
              <Checkbox
              id={"1"}
              label={" "}
              onChange={(e: ChangeEvent<HTMLInputElement>) => LocaleHandler(e)}
              name="locale"/>
            </Holds>
          </Holds>
          <Holds position={"row"}>
            <Holds size={"80"}>
              <Texts size={"p3"} position={"left"} className="my-5">{t("ChooseProfilePicture")}</Texts>
            </Holds>
            <Holds size={"20"}>
              <Checkbox
              size={"5"}
              id={"1"}
              label={" "}
              onChange={(e: ChangeEvent<HTMLInputElement>) => LocaleHandler(e)}
              name="locale"/>
            </Holds>
          </Holds>
          <Holds position={"row"}>
            <Holds size={"80"}>
              <Texts size={"p3"} position={"left"} className="my-5">{t("CreateVirtualSignature")}</Texts>
            </Holds>
            <Holds size={"20"}>
              <Checkbox
              size={"16"}
              id={"1"}
              label={" "}
              onChange={(e: ChangeEvent<HTMLInputElement>) => LocaleHandler(e)}
              name="locale"/>
            </Holds>
          </Holds>
        </Contents>
      </Holds>
      <Holds className="row-span-1 h-full">
        <Buttons background={"green"} onClick={handleNextStep}>
          <Titles>{t("LetsGetStarted")}</Titles>
        </Buttons>
      </Holds>
    </Grids>
  );
};

export default ShiftScanIntro;
