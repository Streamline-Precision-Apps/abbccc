"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useEnhancedOfflineStatus } from "@/hooks/useEnhancedOfflineStatus";
import VerticalLayout from "./verticalLayout";
import HorizontalLayout from "./horizontalLayout";
import { useRouter } from "next/navigation";

export default function MechanicBtn({
  permission,
  view,
}: {
  permission: string;
  view: string;
}) {
  const router = useRouter();
  const t = useTranslations("Widgets");
  const [projectID, setProjectID] = useState("");
  const { isOnline } = useEnhancedOfflineStatus();

  useEffect(() => {
    const checkCookie = async () => {
      if (isOnline) {
        try {
          const response = await fetch(
            "/api/cookies?method=get&name=mechanicProjectID"
          );
          const data = await response.json();
          console.log(data);
          setProjectID(data);
        } catch (error) {
          console.error("Failed to fetch mechanic project ID:", error);
          // Use offline fallback
          const offlineProjectID = localStorage.getItem("mechanicProjectID");
          setProjectID(offlineProjectID || "");
        }
      } else {
        // When offline, use localStorage fallback
        const offlineProjectID = localStorage.getItem("mechanicProjectID");
        setProjectID(offlineProjectID || "");
      }
    };

    checkCookie();
  }, [isOnline]);
  return (
    <>
      {permission !== "USER" && view === "mechanic" ? (
        <VerticalLayout
          text={"Mechanic"}
          titleImg={"/mechanic.svg"}
          titleImgAlt={"Mechanic Icon"}
          color={"green"}
          handleEvent={() => {
            router.push(
              projectID
                ? `/dashboard/mechanic/projects/${projectID}`
                : "/dashboard/mechanic"
            );
          }}
        />
      ) : (
        <HorizontalLayout
          text={"Mechanic"}
          titleImg={"/mechanic.svg"}
          titleImgAlt={"Mechanic Icon"}
          color={"green"}
          handleEvent={() => {
            router.push(
              projectID
                ? `/dashboard/mechanic/projects/${projectID}`
                : "/dashboard/mechanic"
            );
          }}
        />
      )}
    </>
  );
}
