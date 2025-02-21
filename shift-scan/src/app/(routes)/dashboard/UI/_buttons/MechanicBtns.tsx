import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";

export default function MechanicBtn({
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
        "/api/cookies?method=get&name=mechanicProjectID"
      );
      const data = await response.json();
      console.log(data);
      setProjectID(data);
    };

    checkCookie();
  });
  return (
    <>
      {permission !== "USER" && view === "mechanic" ? (
        <Holds position={"row"} className={"row-span-1 col-span-1 gap-5"}>
          <Buttons //----------------------This is the Switch Jobs Widget
            background={"green"}
            href={
              projectID
                ? `/dashboard/mechanic/projects/${projectID}`
                : "/dashboard/mechanic"
            }
          >
            <Holds className="justify-center items-center">
              <Holds size={"40"}>
                <Images
                  titleImg="/mechanic-icon.svg"
                  titleImgAlt="Engineer Icon"
                />
              </Holds>
              <Holds>
                <Texts size={"p3"}>{t("Mechanic")}</Texts>
              </Holds>
            </Holds>
          </Buttons>
        </Holds>
      ) : (
        <Holds
          position={"row"}
          className={
            permission !== "USER" && view === "mechanic"
              ? "row-span-1 col-span-1 gap-5"
              : permission === "USER" && view === "mechanic"
              ? "row-span-1 col-span-2 gap-5"
              : "row-span-1 col-span-1 gap-5"
          }
        >
          <Buttons //----------------------This is the Switch Jobs Widget
            background={"green"}
            href={
              projectID
                ? `/dashboard/mechanic/projects/${projectID}`
                : "/dashboard/mechanic"
            }
          >
            <Holds
              position={"row"}
              className="justify-center items-center gap-2"
            >
              <Texts size={"p2"}>{t("Mechanic")}</Texts>
              <Images
                titleImg="/mechanic-icon.svg"
                titleImgAlt="Engineer Icon"
                size={"30"}
                position={"left"}
              />
            </Holds>
          </Buttons>
        </Holds>
      )}
    </>
  );
}
