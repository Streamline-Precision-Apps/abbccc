import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function SwitchJobsBtn({ permission }: { permission: string }) {
  const t = useTranslations("Widgets");
  return (
    <Holds
      position={"row"}
      className={
        permission !== "USER"
          ? "row-span-1 col-span-1 gap-5"
          : "row-span-1 col-span-1 gap-5"
      }
    >
      <Buttons //----------------------This is the Switch Jobs Widget
        background={"orange"}
        href="/dashboard/switch-jobs"
      >
        <Holds>
          <Images
            titleImg="/jobsite.svg"
            titleImgAlt="Jobsite Icon"
            size={"40"}
          />
        </Holds>
        <Holds>
          <Texts size={"p3"}>{t("Switch")}</Texts>
        </Holds>
      </Buttons>
    </Holds>
  );
}
