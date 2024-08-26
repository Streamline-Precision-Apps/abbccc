"use client";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { setAuthStep } from "@/app/api/auth";
import { useRouter } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";
import { Content } from "next/font/google";
import { Contents } from "@/components/(reusable)/contents";

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
            size={"widgetMed"}
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
          <Buttons
            variant={"green"}
            size={"widgetSm"}
            href="/admin/add-employee"
          >
            <Contents variant={"widgetButton"} size={null}>

            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Equipment Icon"
              variant={"icon"}
              size={"default"}
              />
            <Texts>{t("AddEmployee")}</Texts>
            </Contents>
          </Buttons>
          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            href="/admin/employee-search"
          >
            <Contents variant={"widgetButton"} size={null}>

            <Images
              titleImg="/forms.svg"
              titleImgAlt="Current Equipment Icon"
              variant={"icon"}
              size={"default"}
              />
            <Texts>{t("SeeCurrentEmployees")}</Texts>
            </Contents>
          </Buttons>
        </>
      ) : additionalButtonsType === "asset" ? (
          <>
          <Buttons
            variant={"default"}
            size={"widgetMed"}
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
          <Buttons variant={"orange"} size={"widgetMed"}  href="/admin/assets">
          <Contents variant={"widgetButton"} size={null}>
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Home Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>Manage Assets </Texts>
          </Contents>
          </Buttons>
        </>
      ) : additionalButtonsType === "reports" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetMed"}
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
          <Buttons variant={"orange"} size={"widgetMed"} href="/admin/reports">
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
            <Texts>Dashboard</Texts>
              </Contents>
          </Buttons>
        </>
      )}
    </>
  );
};
