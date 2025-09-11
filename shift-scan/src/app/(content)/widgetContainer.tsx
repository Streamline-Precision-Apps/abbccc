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
  disabled?: boolean;
};

export default function WidgetContainer({
  titleImg,
  titleImgAlt,
  text,
  textSize = "h5",
  background,
  translation,
  disabled = false,
  href,
}: Props) {
  const t = useTranslations(translation);
  return (
    <Buttons
      background={disabled ? "darkGray" : background}
      href={href}
      className="h-full w-full flex flex-col justify-center items-center space-y-1 "
      disabled={disabled}
    >
      <img
        src={titleImg}
        alt={titleImgAlt}
        className="h-full w-full max-h-[40px] max-w-[40px] object-contain"
      />
      <Titles size={textSize}>{t(text)}</Titles>
    </Buttons>
  );
}
