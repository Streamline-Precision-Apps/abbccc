"use server";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import TruckDriver from "./TruckingDriver";
import TruckManualLabor from "./TruckManualLabor";
import TruckOperator from "./TruckingOperator";

export default async function Inbox() {
  const session = await auth();
  if (!session) return null;
  const t = await getTranslations("Widgets");
  const laborType = cookies().get("laborType")?.value;

  return (
    <Bases>
      <Contents>
        <Grids rows={"6"} gap={"5"} className="h-full">
          <Holds background={"white"} className="row-span-1 h-full ">
            <TitleBoxes
              title={
                laborType === "truckDriver"
                  ? t("TruckDriver")
                  : laborType === "operator"
                  ? t("Operator")
                  : laborType === "manualLabor"
                  ? t("ManualLabor")
                  : t("TruckingAssistant")
              }
            />
          </Holds>
          <Holds className="row-span-5 h-full">
            {laborType === "truckDriver" ? (
              <TruckDriver />
            ) : laborType === "truckLabor" ? (
              <TruckManualLabor />
            ) : laborType === "truckEquipmentOperator" ? (
              <TruckOperator />
            ) : null}
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
