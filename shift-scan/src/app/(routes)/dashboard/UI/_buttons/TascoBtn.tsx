import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function TascoBtn({
  permission,
  view,
}: {
  permission: string;
  view: string;
}) {
  const t = useTranslations("Widgets");
  return (
    <Holds
      position={"row"}
      className={
        permission !== "USER"
          ? "row-span-1 col-span-2 gap-5"
          : permission === "USER" && view === "tasco"
          ? "row-span-1 col-span-2 gap-5"
          : "row-span-1 col-span-2 gap-5"
      }
    >
      <Buttons //----------------------This is the Switch Jobs Widget
        background={"orange"}
        href="/dashboard/tasco"
      >
        <Holds position={"row"} className="justify-center items-center">
          <Holds>
            <Images
              titleImg="/person.svg"
              titleImgAlt={t("TascoAssistant")}
              size={"40"}
            />
          </Holds>
          <Holds>
            <Texts size={"p4"}>{t("TascoAssistant")}</Texts>
          </Holds>
        </Holds>
      </Buttons>
    </Holds>
  );
}
