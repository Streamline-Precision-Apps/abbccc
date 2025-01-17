import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function FormsBtn({
  permission,
  view,
}: {
  permission: string;
  view: string | null;
}) {
  const t = useTranslations("Widgets");
  return (
    <Holds
      position={"row"}
      className={
        permission !== "USER" && view === "general"
          ? "row-span-1 col-span-1"
          : permission !== "USER" && view === "mechanic"
          ? "row-span-1 col-span-1 gap-5"
          : permission !== "USER" && view === "truck"
          ? "row-span-1 col-span-1 gap-5"
          : permission !== "USER" && view === "tasco"
          ? "row-span-1 col-span-1 gap-5"
          : permission === "USER" && view === "tasco"
          ? "row-span-1 col-span-1 gap-5"
          : permission === "USER" && view === "mechanic"
          ? "row-span-1 col-span-1 gap-5"
          : permission === "USER" && view === "truck"
          ? "row-span-1 col-span-1 gap-5"
          : "row-start-2 col-span-2 gap-5"
      }
    >
      <Buttons //----------------------This is the Forms Widget
        background={"green"}
        href="/dashboard/forms"
      >
        <Holds
          position={
            permission !== "USER"
              ? undefined
              : permission === "USER" && view === "tasco"
              ? undefined
              : permission === "USER" && view === "truck"
              ? undefined
              : permission === "USER" && view === "mechanic"
              ? undefined
              : "row"
          }
        >
          <Holds>
            <Images
              titleImg="/form.svg"
              titleImgAlt="Forms Icon"
              size={"40"}
              className="ml-2"
            />
          </Holds>
          <Holds>
            <Texts size={"p3"}>{t("Forms")}</Texts>
          </Holds>
        </Holds>
      </Buttons>
    </Holds>
  );
}
