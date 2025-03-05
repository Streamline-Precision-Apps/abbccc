import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { ButtonVariants } from "@/components/(reusable)/buttons";

export default function HorizontalLayout({
  color,
  handleEvent,
  text,
  titleImg,
  titleImgAlt,
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
}) {
  const t = useTranslations("Widgets");
  return (
    <Holds position={"row"} className={"row-span-1 col-span-2"}>
      <Buttons background={color}>
        <Holds className="cursor-pointer" onClick={handleEvent}>
          <Holds position={"row"}>
            <Holds size={"60"} className="justify-center items-center">
              <Texts size={"p1"}>{t(text)}</Texts>
            </Holds>
            <Holds size={"40"} className="p-2">
              <Images titleImg={titleImg} titleImgAlt={titleImgAlt} />
            </Holds>
          </Holds>
        </Holds>
      </Buttons>
    </Holds>
  );
}
