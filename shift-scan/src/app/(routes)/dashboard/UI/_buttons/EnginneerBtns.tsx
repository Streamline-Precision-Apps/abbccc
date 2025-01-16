import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function EngineerBtn({ permission }: { permission: string }) {
  const t = useTranslations("Widgets");
  return (
    <Holds
      position={"row"}
      className={
        permission !== "USER"
          ? "row-span-1 col-span-2 gap-5"
          : "row-span-1 col-span-1 gap-5"
      }
    >
      <Buttons //----------------------This is the Switch Jobs Widget
        background={"orange"}
        href="/dashboard/engineer"
      >
        <Holds className="justify-center items-center">
          <Holds size={"50"}>
            <Images
              titleImg="/person.svg"
              titleImgAlt="Engineer Icon"
              size={"40"}
            />
          </Holds>
          <Holds>
            <Texts size={"p3"}>{t("Maintenance")}</Texts>
          </Holds>
        </Holds>
      </Buttons>
    </Holds>
  );
}
