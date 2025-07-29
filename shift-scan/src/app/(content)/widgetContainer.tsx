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
    <Buttons
      background={background}
      href={href}
      className="h-full w-full flex flex-col justify-center items-center gap-2"
    >
      <img
        src={titleImg}
        alt={titleImgAlt}
        className="h-full w-full max-h-[50px] max-w-[50px] object-contain"
      />
      <Titles size={textSize}>{t(text)}</Titles>
    </Buttons>
  );
}
