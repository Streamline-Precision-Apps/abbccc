import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function VerticalLayout({
  color,
  handleEvent,
  text,
  titleImg,
  titleImgAlt,
  href,
}: {
  color?:
    | "none"
    | "white"
    | "red"
    | "green"
    | "orange"
    | "darkBlue"
    | "lightBlue"
    | "darkGray"
    | "lightGray"
    | null
    | undefined;
  handleEvent?: () => void;
  titleImg: string;
  titleImgAlt: string;
  text: string;
  href?: string;
}) {
  const t = useTranslations("Widgets");
  return (
    <Holds position={"row"} className={"row-span-1 col-span-1"}>
      <Buttons //----------------------This is the Clock Out Widget
        background={color}
        href={href}
        onClick={handleEvent}
      >
        <Holds className="w-full h-full justify-center">
          <Images titleImg={titleImg} titleImgAlt={titleImgAlt} size={"40"} />
          <Texts size={"p3"}>{t(text)}</Texts>
        </Holds>
      </Buttons>
    </Holds>
  );
}
