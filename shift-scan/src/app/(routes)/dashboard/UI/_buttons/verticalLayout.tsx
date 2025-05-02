import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export default function VerticalLayout({
  color,
  handleEvent,
  text,
  titleImg,
  titleImgAlt,
  textSize = "h3",
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

  titleImg: string;
  titleImgAlt: string;
  text: string;
  handleEvent?: () => void;
  textSize?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  const t = useTranslations("Widgets");
  return (
    <Buttons background={color} onClick={handleEvent} className="h-full w-full">
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
