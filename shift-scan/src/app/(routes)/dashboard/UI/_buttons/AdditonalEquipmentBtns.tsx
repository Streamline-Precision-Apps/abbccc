import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function EquipmentWidget({
  handleShowManagerButtons,
}: {
  handleShowManagerButtons: () => void;
}) {
  const t = useTranslations("Widgets");
  return (
    <>
      <Holds className="col-span-2 row-span-1 gap-5 h-full">
        <Buttons background={"green"} href="/dashboard/log-new">
          <Holds position={"row"} className="my-auto">
            <Holds size={"60"}>
              <Texts size={"p1"}>{t("LogNew")}</Texts>
            </Holds>
            <Holds size={"40"}>
              <Images
                titleImg="/equipment.svg"
                titleImgAlt="Equipment Icon"
                size={"40"}
              />
            </Holds>
          </Holds>
        </Buttons>
      </Holds>
      <Holds className="col-span-2 row-span-1 gap-5 h-full">
        <Buttons background={"orange"} href="/dashboard/equipment">
          <Holds position={"row"} className="my-auto">
            <Holds size={"60"}>
              <Texts size={"p1"}>{t("LogOut")}</Texts>
            </Holds>
            <Holds size={"40"}>
              <Images
                titleImg="/current-equipment.svg"
                titleImgAlt="Equipment Icon"
                size={"50"}
              />
            </Holds>
          </Holds>
        </Buttons>
      </Holds>
      <Holds className="col-span-2 row-span-1 gap-5 h-full">
        <Buttons background={"lightBlue"} onClick={handleShowManagerButtons}>
          <Holds position={"row"} className="my-auto">
            <Holds size={"60"}>
              <Texts size={"p1"}>{t("GoHome")}</Texts>
            </Holds>
            <Holds size={"40"}>
              <Images
                titleImg="/home.svg"
                titleImgAlt="Home Icon"
                size={"50"}
              />
            </Holds>
          </Holds>
        </Buttons>
      </Holds>
    </>
  );
}
