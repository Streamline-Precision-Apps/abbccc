"use client";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { setAuthStep } from "@/app/api/auth";
import { useRouter } from "next/navigation";
import { Contents } from "@/components/(reusable)/contents";

type AdminProps = {
  additionalButtonsType: string | null;
  handleResetButtons: () => void;
  handleShowAdditionalButtons: (type: string) => void;
}

export default function Admin({
  additionalButtonsType,
  handleResetButtons,
  handleShowAdditionalButtons,
} : AdminProps) {
  const t = useTranslations("admin");
  const Router = useRouter();

  function switchToDashboard(): void {
    Router.push("/");
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
              <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/home.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
              />
            <Texts>{t("Home")}</Texts>
              </Contents>
          </Buttons>
          <Buttons variant={"orange"} size={"widgetSm"} href="/admin/employees">
          <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Equipment Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("ManageEmployees")}</Texts>
          </Contents>
          </Buttons>
        </>
      ) : additionalButtonsType === "asset" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleResetButtons}
          >
             <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/home.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("Home")}</Texts>
             </Contents>
          </Buttons>
          <Buttons variant={"orange"} size={"widgetSm"} href="/admin/assets">
          <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>Manage Assest</Texts>
          </Contents>
          </Buttons>
        </>
      ) : additionalButtonsType === "reports" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleResetButtons}
          >
            <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/home.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
              />
            <Texts>{t("Home")}</Texts>
              </Contents>
          </Buttons>
          <Buttons variant={"orange"} size={"widgetSm"} href="/admin/reports">
          <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/forms.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>Extract Reports</Texts>
          </Contents>
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
            <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/myTeam.svg"
              titleImgAlt="my team"
              variant={"icon"}
              size={"widgetSm"}
              ></Images>
            <Texts>{t("Recruitment")}</Texts>
              </Contents>
          </Buttons>
          <Buttons
            href=""
            variant={"green"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("asset")}
          >
            <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Equipment Icon"
              variant={"icon"}
              size={"widgetSm"}
              ></Images>
            <Texts>{t("Assets")}</Texts>
              </Contents>
          </Buttons>
          <Buttons
            variant={"red"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("reports")}
          >
            <Contents variant={"widgetButton"} size={null}>

            <Images
              titleImg="/clockOut.svg"
              titleImgAlt="Clock Out Icon"
              variant={"icon"}
              size={"widgetSm"}
              ></Images>
            <Texts>{t("reports")}</Texts>
              </Contents>
          </Buttons>

          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            onClick={() => switchToDashboard()}
          >
          <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/home.svg"
              titleImgAlt="Clock Out Icon"
              variant={"icon"}
              size={"widgetSm"}
              ></Images>
            <Texts>Return to Home</Texts>
              </Contents>
          </Buttons>
        </>
      )}
    </>
  );
};
