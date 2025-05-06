"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function GeneratorBtn() {
  const t = useTranslations("Widgets");
  return (
    <>
      <Holds position={"row"} className="row-span-1 col-span-1 gap-5">
        <Buttons //----------------------This is the QR Generator Widget
          background={"lightBlue"}
          href="/dashboard/qr-generator"
        >
          <Holds>
            <Images titleImg="/qrCode.svg" titleImgAlt="QR Code" size={"40"} />
          </Holds>
          <Holds>
            <Texts size={"p3"}>{t("QR")}</Texts>
          </Holds>
        </Buttons>
      </Holds>
    </>
  );
}
