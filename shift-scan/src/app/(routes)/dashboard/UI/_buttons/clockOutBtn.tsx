import { useTranslations } from "next-intl";

import ClockOutLayout from "./verticalLayout";
import { Holds } from "@/components/(reusable)/holds";
import HorizontalLayout from "./horizontalLayout";
import VerticalLayout from "./verticalLayout";

export default function ClockOutBtn({
  permission,
  handleShowAdditionalButtons,
  View,
  laborType,
}: {
  permission: string;
  View: string | null;
  handleShowAdditionalButtons: (button: string) => void;
  laborType: string;
}) {
  const t = useTranslations("Widgets");
  return (
    <>
      {/*Truck Driver Clock Out Button layout */}
      {permission !== "USER" ? (
        <>
          {/* Manager Clock Out for Trucking */}
          {View === "truck" && (
            <>
              {laborType === "truckDriver" && (
                <HorizontalLayout
                  text={"ClockOut"}
                  titleImg={"/clock-out.svg"}
                  titleImgAlt={"clock Out Icon"}
                  color={"red"}
                  handleEvent={() => handleShowAdditionalButtons("clockOut")}
                />
              )}
              {laborType === "truckEquipmentOperator" && (
                <HorizontalLayout
                  text={"ClockOut"}
                  titleImg={"/clock-out.svg"}
                  titleImgAlt={"clock Out Icon"}
                  color={"red"}
                  handleEvent={() => handleShowAdditionalButtons("clockOut")}
                />
              )}

              {laborType === "truckLabor" && (
                <VerticalLayout
                  color={"red"}
                  text={"ClockOut"}
                  titleImg={"/clock-out.svg"}
                  titleImgAlt={"clock Out Icon"}
                  handleEvent={() => handleShowAdditionalButtons("clockOut")}
                />
              )}
            </>
          )}

          {/* Manager Clock Out for Mechanic */}
          {View === "mechanic" && (
            <>
              <HorizontalLayout
                color={"red"}
                text={"ClockOut"}
                titleImg={"/clock-out.svg"}
                titleImgAlt={"clock Out Icon"}
                handleEvent={() => handleShowAdditionalButtons("clockOut")}
              />
            </>
          )}
          {View === "tasco" && (
            <>
              <HorizontalLayout
                color={"red"}
                text={"ClockOut"}
                titleImg={"/clock-out.svg"}
                titleImgAlt={"clock Out Icon"}
                handleEvent={() => handleShowAdditionalButtons("clockOut")}
              />
            </>
          )}
          {View === "general" && (
            <>
              <HorizontalLayout
                color={"red"}
                text={"ClockOut"}
                titleImg={"/clock-out.svg"}
                titleImgAlt={"clock Out Icon"}
                handleEvent={() => handleShowAdditionalButtons("clockOut")}
              />
            </>
          )}
        </>
      ) : (
        <>
          {/* User Clock Out */}
          {View === "truck" && (
            <HorizontalLayout
              text={"ClockOut"}
              titleImg={"/clock-out.svg"}
              titleImgAlt={"clock Out Icon"}
              color={"red"}
              handleEvent={() => handleShowAdditionalButtons("clockOut")}
            />
          )}
          {View === "mechanic" && (
            <HorizontalLayout
              text={"ClockOut"}
              titleImg={"/clock-out.svg"}
              titleImgAlt={"clock Out Icon"}
              color={"red"}
              handleEvent={() => handleShowAdditionalButtons("clockOut")}
            />
          )}
          {View === "tasco" && (
            <>
              <HorizontalLayout
                color={"red"}
                text={"ClockOut"}
                titleImg={"/clock-out.svg"}
                titleImgAlt={"clock Out Icon"}
                handleEvent={() => handleShowAdditionalButtons("clockOut")}
              />
            </>
          )}
          {View === "general" && (
            <>
              <HorizontalLayout
                color={"red"}
                text={"ClockOut"}
                titleImg={"/clock-out.svg"}
                titleImgAlt={"clock Out Icon"}
                handleEvent={() => handleShowAdditionalButtons("clockOut")}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
