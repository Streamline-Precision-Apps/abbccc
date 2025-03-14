"use client";
import React from "react";
import { Images } from "../(reusable)/images";
import { Buttons } from "../(reusable)/buttons";
import { Texts } from "../(reusable)/texts";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { Contents } from "../(reusable)/contents";
import { useTranslations } from "next-intl";
import { CheckBox } from "../(inputs)/checkBox";

export const SignUpOutro = ({
  handleComplete,
}: {
  handleComplete: () => void;
}) => {
  const t = useTranslations("SignUpOutro");

  return (
    <Grids rows={"10"} gap={"5"} className=" mb-5">
      <Holds background={"white"} className="row-span-3 h-full justify-center">
        <Images
          titleImg={"/shiftScanLogo.svg"}
          titleImgAlt={t("LogoAlt")}
          size={"30"}
          background={"white"}
        />
        <Contents width={"section"}>
          <Holds className="my-auto">
            <Texts size={"p3"}>{t("LooksLikeYoureAllSetUp")}</Texts>
          </Holds>
        </Contents>
      </Holds>
      <Holds background={"white"} className="row-span-6 h-full">
        <Contents width={"section"} className="mt-5 p-2">
          <Titles size={"h3"}>{t("HeresWhatWeDid")}</Titles>
          <Holds className="justify-around my-auto h-full">
            <Holds position={"row"}>
              <Holds size={"80"}>
                <Texts size={"p4"} position={"left"} className="my-5">
                  {t("ChooseNewPassword")}
                </Texts>
              </Holds>
              <Holds size={"20"}>
                <CheckBox
                  size={3}
                  id={"1"}
                  label={" "}
                  disabled={true}
                  defaultChecked
                  name="locale"
                />
              </Holds>
            </Holds>
            <Holds position={"row"}>
              <Holds size={"80"}>
                <Texts size={"p4"} position={"left"} className="my-5">
                  {t("GivePermissions")}
                </Texts>
              </Holds>
              <Holds size={"20"}>
                <CheckBox
                  size={3}
                  id={"1"}
                  label={" "}
                  disabled={true}
                  defaultChecked
                  name="locale"
                />
              </Holds>
            </Holds>
            <Holds position={"row"}>
              <Holds size={"80"}>
                <Texts size={"p4"} position={"left"} className="my-5">
                  {t("ChooseProfilePicture")}
                </Texts>
              </Holds>
              <Holds size={"20"}>
                <CheckBox
                  size={3}
                  id={"1"}
                  label={" "}
                  disabled={true}
                  defaultChecked
                  name="locale"
                />
              </Holds>
            </Holds>
            <Holds position={"row"}>
              <Holds size={"80"}>
                <Texts size={"p4"} position={"left"} className="my-5">
                  {t("CreateVirtualSignature")}
                </Texts>
              </Holds>
              <Holds size={"20"}>
                <CheckBox
                  size={3}
                  id={"1"}
                  label={""}
                  disabled={true}
                  defaultChecked
                  name="locale"
                />
              </Holds>
            </Holds>
          </Holds>
        </Contents>
      </Holds>
      <Holds className="row-span-1 h-full">
        <Buttons background={"green"} onClick={handleComplete}>
          <Titles>{t("StartScanning")}</Titles>
        </Buttons>
      </Holds>
    </Grids>
  );
};
