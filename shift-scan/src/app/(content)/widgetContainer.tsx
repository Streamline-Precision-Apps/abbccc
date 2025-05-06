import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

type Props = {
  titleImg: string;
  titleImgAlt: string;
  text: string;
  background?:
    | "lightBlue"
    | "darkBlue"
    | "none"
    | "white"
    | "red"
    | "green"
    | "orange"
    | "darkGray"
    | "lightGray"
    | null
    | undefined;
  textSize?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  translation: string;
  href?: string;
};

export default function WidgetContainer({
  titleImg,
  titleImgAlt,
  text,
  textSize = "h3",
  background,
  translation,
  href,
}: Props) {
  const t = useTranslations(translation);
  return (
    <Buttons background={background} href={href} className="h-full w-full">
      <Grids rows={"3"} gap={"4"} className="h-full w-full p-5">
        <Holds className="row-span-2 h-full p-1 ">
          <Images
            titleImg={titleImg}
            titleImgAlt={titleImgAlt}
            className="m-auto h-full w-full"
          />
        </Holds>
        <Holds className="row-span-1 h-full justify-center">
          <Titles size={textSize}>{t(text)}</Titles>
        </Holds>
      </Grids>
    </Buttons>
  );
}
