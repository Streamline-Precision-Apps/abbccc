"use client";

import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { getTranslations } from "next-intl/server";

import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import TruckDriver from "../TruckingDriver";
import TruckManualLabor from "../TruckManualLabor";
import TruckOperator from "../TruckingOperator";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function TruckingContexts({
  laborType,
}: {
  laborType: string | undefined;
}) {
  const t = useTranslations("Widgets");
  const router = useRouter();

  return (
    <>
      <Holds background={"white"} className="row-start-1 row-end-2 h-full ">
        <TitleBoxes onClick={() => router.push("/dashboard")}>
          <Holds
            position={"row"}
            className=" w-full justify-center items-center"
          >
            <Titles size={"h2"}>
              {laborType === "truckDriver"
                ? t("TruckDriver")
                : laborType === "operator"
                ? t("Operator")
                : laborType === "manualLabor"
                ? t("ManualLabor")
                : t("TruckingAssistant")}
            </Titles>
            <Images
              className="w-8 h-8 ml-2"
              titleImg={"/trucking.svg"}
              titleImgAlt={"Truck"}
            />
          </Holds>
        </TitleBoxes>
      </Holds>
      <Holds className="row-start-2 row-end-8 h-full">
        {laborType === "truckDriver" ? (
          <TruckDriver />
        ) : laborType === "truckLabor" ? (
          <TruckManualLabor />
        ) : laborType === "truckEquipmentOperator" ? (
          <TruckOperator />
        ) : null}
      </Holds>
    </>
  );
}
