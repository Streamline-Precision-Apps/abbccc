"use client";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";

interface AdminProps {
  additionalButtonsType: string | null;
  handleResetButtons: () => void;
  handleShowAdditionalButtons: (type: string) => void;
}

export const Admin: React.FC<AdminProps> = ({
  additionalButtonsType,
  handleResetButtons,
  handleShowAdditionalButtons,
}) => {
  const t = useTranslations("admin");

  return (
    <>
      {additionalButtonsType === "recruitment" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleResetButtons}
          >
            <div className="flex flex-row justify-center items-center ">
              <Images
                titleImg="/home.svg"
                titleImgAlt="Home Icon"
                variant={"icon"}
                size={"default"}
              ></Images>
              <Texts>{t("Home")}</Texts>
            </div>
          </Buttons>
          <Buttons
            variant={"green"}
            size={"widgetSm"}
            href="/admin/add-employee"
          >
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Equipment Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("AddEmployee")}</Texts>
          </Buttons>
          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            href="/admin/employee-search"
          >
            <Images
              titleImg="/forms.svg"
              titleImgAlt="Current Equipment Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("SeeCurrentEmployees")}</Texts>
          </Buttons>
        </>
      ) : additionalButtonsType === "asset" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleResetButtons}
          >
            <Texts>{t("Home")}</Texts>
          </Buttons>
          <Buttons variant={"orange"} size={"widgetSm"}>
            <Texts>AssetButton1</Texts>
          </Buttons>
          <Buttons variant={"red"} size={"widgetSm"}>
            <Texts>AssetButton2</Texts>
          </Buttons>
          <Buttons variant={"red"} size={"widgetSm"}>
            <Texts>AssetButton3</Texts>
          </Buttons>
        </>
      ) : additionalButtonsType === "reports" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleResetButtons}
          >
            <Texts>{t("Home")}</Texts>
          </Buttons>
        </>
      ) : (
        <>
          <Buttons
            href=""
            variant={"default"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("recruitment")}
          >
            <Images
              titleImg="/myTeam.svg"
              titleImgAlt="my team"
              variant={"icon"}
              size={"widgetSm"}
            ></Images>
            <Texts>{t("Recruitment")}</Texts>
          </Buttons>
          <Buttons
            href=""
            variant={"green"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("asset")}
          >
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Equipment Icon"
              variant={"icon"}
              size={"widgetSm"}
            ></Images>
            <Texts>{t("Assets")}</Texts>
          </Buttons>
          <Buttons
            variant={"red"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("reports")}
          >
            <Images
              titleImg="/clockOut.svg"
              titleImgAlt="Clock Out Icon"
              variant={"icon"}
              size={"widgetSm"}
            ></Images>
            <Texts>{t("reports")}</Texts>
          </Buttons>
        </>
      )}
    </>
  );
};
