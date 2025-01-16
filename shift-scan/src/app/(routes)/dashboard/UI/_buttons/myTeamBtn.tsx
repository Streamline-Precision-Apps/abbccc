import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function MyTeamWidget() {
  const t = useTranslations("Widgets");
  return (
    <>
      <Holds position={"row"} className="row-span-1 col-span-1 gap-5">
        <Buttons //----------------------This is the My Team Widget
          background={"lightBlue"}
          href="/dashboard/myTeam"
        >
          <Holds>
            <Images
              titleImg="/team.svg"
              titleImgAlt={t("MyTeam")}
              size={"40"}
            />
          </Holds>
          <Holds>
            <Texts size={"p3"}>{t("MyTeam")}</Texts>
          </Holds>
        </Buttons>
      </Holds>
    </>
  );
}
