import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";

export default function EngineerBtn({
  permission,
  view,
}: {
  permission: string;
  view: string;
}) {
  const t = useTranslations("Widgets");
  const [projectID, setProjectID] = useState("");

  useEffect(() => {
    const checkCookie = async () => {
      const response = await fetch(
        "/api/cookie?method=get&name=mechanicProjectID"
      );
      const data = await response.json();
      if (data) {
        setProjectID(data);
      }
    };
  });
  return (
    <Holds
      position={"row"}
      className={
        permission !== "USER" && view === "mechanic"
          ? "row-span-1 col-span-2 gap-5"
          : permission === "USER" && view === "mechanic"
          ? "row-span-1 col-span-2 gap-5"
          : "row-span-1 col-span-1 gap-5"
      }
    >
      <Buttons //----------------------This is the Switch Jobs Widget
        background={"orange"}
        href={
          projectID
            ? `/dashboard/mechanic/projects/${projectID}`
            : "/dashboard/mechanic"
        }
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
