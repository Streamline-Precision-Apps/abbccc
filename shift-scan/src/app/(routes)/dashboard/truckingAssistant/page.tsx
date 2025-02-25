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
  const timeSheetId = cookies().get("timeSheetId")?.value;

  return (
    <Bases>
      <Contents>
        <Grids rows={"6"} gap={"5"}>
          <Holds background={"white"} className="row-span-1 h-full ">
            <TitleBoxes
              title={
                laborType === "truckDriver"
                  ? t("TruckDriver")
                  : laborType === "manualLabor"
                  ? t("Operator")
                  : laborType === "operator"
                  ? t("ManualLabor")
                  : t("TruckingAssistant")
              }
              titleImg="/trucking.svg"
              titleImgAlt="Truck"
            />
          </Holds>
          <Holds className="row-span-5 h-full">
            {laborType === "truckDriver" ? (
              <TruckDriver timeSheetId={timeSheetId} />
            ) : laborType === "manualLabor" ? (
              <TruckManualLabor timeSheetId={timeSheetId} />
            ) : laborType === "operator" ? (
              <TruckOperator timeSheetId={timeSheetId} />
            ) : null}
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
