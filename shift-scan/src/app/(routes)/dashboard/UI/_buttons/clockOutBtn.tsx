import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function ClockOutBtn({
  permission,
  handleShowAdditionalButtons,
  View,
}: {
  permission: string;
  View: string | null;
  handleShowAdditionalButtons: (button: string) => void;
}) {
  const t = useTranslations("Widgets");
  return (
    <Holds
      position={"row"}
      className={
        permission !== "USER" && View === "general"
          ? "row-span-1 col-span-1 gap-5"
          : permission !== "USER" && View === "mechanic"
          ? "row-span-1 col-span-1 gap-5"
          : permission !== "USER" && View === "truck"
          ? "row-span-1 col-span-1 gap-5"
          : permission !== "USER" && View === "equipment"
          ? "row-span-1 col-span-1 gap-5"
          : permission === "USER" && View === "truck"
          ? "row-span-1 col-span-1 gap-5"
          : "row-span-1 col-span-2 gap-5"
      }
    >
      <Buttons //----------------------This is the Clock Out Widget
        href="/dashboard/clock-out"
        background={"red"}
        onClick={() => handleShowAdditionalButtons("clockOut")}
      >
        <Holds
          position={
            permission !== "USER" && View === "general"
              ? undefined
              : permission !== "USER" && View === "truck"
              ? undefined
              : permission === "USER" && View === "truck"
              ? undefined
              : permission !== "USER" && View === "mechanic"
              ? undefined
              : "row"
          }
        >
          <Holds
          // size={View === "mechanic" && permission !== "USER" ? "50" : null}
          >
            <Images
              titleImg="/clock-out.svg"
              titleImgAlt="Clock Out Icon"
              size={"40"}
            />
          </Holds>
          <Holds>
            <Texts size={"p3"}>{t("ClockOut")}</Texts>
          </Holds>
        </Holds>
      </Buttons>
    </Holds>
  );
}
