"use client";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useRouter } from "next/navigation";
import { Contents } from "@/components/(reusable)/contents";

type AdminProps = {
  additionalButtonsType: string | null;
  handleResetButtons: () => void;
  handleShowAdditionalButtons: (type: string) => void;
};

export default function Admin({
  additionalButtonsType,
  handleResetButtons,
  handleShowAdditionalButtons,
}: AdminProps) {
  const t = useTranslations("admin");
  const Router = useRouter();

  function switchToDashboard(): void {
    Router.push("/");
  }

  return (
    <>
      {additionalButtonsType === "recruitment" ? (
        <>
          <Buttons background={"lightBlue"} onClick={handleResetButtons}>
            <Contents width={"section"}>
              <Images titleImg="/new/home.svg" titleImgAlt="Home Icon" />
              <Texts>{t("Home")}</Texts>
            </Contents>
          </Buttons>
          <Buttons background={"orange"} href="/admin/employees">
            <Contents>
              <Images titleImg="/person.svg" titleImgAlt="profile Icon" />
              <Texts>{t("ManageEmployees")}</Texts>
            </Contents>
          </Buttons>
          <Buttons background={"orange"} href="/admin/teamManagement">
            <Contents>
              <Images titleImg="/team.svg" titleImgAlt="team Icon" />
              <Texts>{t("ManageTeams")}</Texts>
            </Contents>
          </Buttons>
        </>
      ) : additionalButtonsType === "asset" ? (
        <>
          <Buttons background={"lightBlue"} onClick={handleResetButtons}>
            <Contents>
              <Images titleImg="/new/home.svg" titleImgAlt="Home Icon" />
              <Texts>{t("Home")}</Texts>
            </Contents>
          </Buttons>
          <Buttons background={"orange"} href="/admin/assets">
            <Contents>
              <Images titleImg="/new/equipment.svg" titleImgAlt="Home Icon" />
              <Texts>Manage Assest</Texts>
            </Contents>
          </Buttons>
        </>
      ) : additionalButtonsType === "reports" ? (
        <>
          <Buttons background={"lightBlue"} onClick={handleResetButtons}>
            <Contents>
              <Images titleImg="/new/home.svg" titleImgAlt="Home Icon" />
              <Texts>{t("Home")}</Texts>
            </Contents>
          </Buttons>
          <Buttons background={"orange"} href="/admin/reports">
            <Contents>
              <Images titleImg="/new/forms.svg" titleImgAlt="Home Icon" />
              <Texts>Extract Reports</Texts>
            </Contents>
          </Buttons>
        </>
      ) : (
        <>
          <Buttons
            href=""
            background={"lightBlue"}
            onClick={() => handleShowAdditionalButtons("recruitment")}
          >
            <Contents>
              <Images titleImg="/new/myTeam.svg" titleImgAlt="my team"></Images>
              <Texts>{t("Recruitment")}</Texts>
            </Contents>
          </Buttons>
          <Buttons
            href=""
            background={"green"}
            onClick={() => handleShowAdditionalButtons("asset")}
          >
            <Contents>
              <Images
                titleImg="/new/equipment.svg"
                titleImgAlt="Equipment Icon"
              ></Images>
              <Texts>{t("Assets")}</Texts>
            </Contents>
          </Buttons>
          <Buttons
            background={"red"}
            onClick={() => handleShowAdditionalButtons("reports")}
          >
            <Contents>
              <Images
                titleImg="/new/clockOut.svg"
                titleImgAlt="Clock Out Icon"
              ></Images>
              <Texts>{t("reports")}</Texts>
            </Contents>
          </Buttons>

          <Buttons background={"orange"} onClick={() => switchToDashboard()}>
            <Contents>
              <Images
                titleImg="/new/home.svg"
                titleImgAlt="Clock Out Icon"
              ></Images>
              <Texts>Return to Home</Texts>
            </Contents>
          </Buttons>
        </>
      )}
    </>
  );
}
