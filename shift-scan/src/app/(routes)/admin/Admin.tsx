"use client";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { setAuthStep } from "@/app/api/auth";
import { useRouter } from "next/navigation";

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
  const Router = useRouter();

  function switchToDashboard(): void {
    setAuthStep("success");
    Router.push("/dashboard");
  }

  return (
    <>
      {additionalButtonsType === "recruitment" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleResetButtons}
          >
            <Images
              titleImg="/home.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("Home")}</Texts>
          </Buttons>
          <Buttons variant={"orange"} size={"widgetSm"} href="/admin/employees">
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Equipment Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("ManageEmployees")}</Texts>
          </Buttons>
        </>
      ) : additionalButtonsType === "asset" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleResetButtons}
          >
            <Images
              titleImg="/home.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("Home")}</Texts>
          </Buttons>
          <Buttons variant={"orange"} size={"widgetSm"} href="/admin/assets">
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>Manage Equipment</Texts>
          </Buttons>
          <Buttons variant={"orange"} size={"widgetSm"} href="/admin/assets">
            <Images
              titleImg="/qrCode.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"widgetSm"}
            />
            <Texts>Manage Jobsites </Texts>
          </Buttons>
          <Buttons variant={"orange"} size={"widgetSm"} href="/admin/assets">
            <Images
              titleImg="/jobsite.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>Manage Cost Codes</Texts>
          </Buttons>
        </>
      ) : additionalButtonsType === "reports" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleResetButtons}
          >
            <Images
              titleImg="/home.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("Home")}</Texts>
          </Buttons>
          <Buttons variant={"orange"} size={"widgetSm"} href="/admin/reports">
            <Images
              titleImg="/forms.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>Extract Reports</Texts>
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

          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            onClick={() => switchToDashboard()}
          >
            <Images
              titleImg="/home.svg"
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
