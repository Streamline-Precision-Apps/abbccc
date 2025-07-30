import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

type Props = {
  returnToMain: () => void;
};
/**
 * Displays a Controller panel to close the time tracking visualization and redirect to the timesheets page.
 */
export default function TopControlPanel({ returnToMain }: Props) {
  const t = useTranslations("Home");
  return (
    <>
      <Holds size={"20"} className="h-full mr-5">
        <Buttons background={"red"} onClick={returnToMain}>
          <Images
            titleImg={"/arrowBack.svg"}
            titleImgAlt="return"
            className="mx-auto w-8 h-auto object-contain"
          />
        </Buttons>
      </Holds>
      <Holds size={"80"} className="h-full">
        <Buttons href={"/timesheets"} background={"green"}>
          <Titles size={"h5"}>{t("TimeSheet-Label")}</Titles>
        </Buttons>
      </Holds>
    </>
  );
}
