import Spinner from "@/components/(animations)/spinner";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export const PreInjuryReport = ({
  handleCheckboxChange,
  checked,
  loading,
  base64String,
  handleNextStepAndSubmit,
  prevStep,
}: {
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  loading: boolean;
  base64String: string;
  prevStep: () => void;
  handleNextStepAndSubmit: () => void;
}) => {
  const t = useTranslations("ClockOut");
  return (
    <Bases>
      <Contents>
        <Holds background={"white"} className="h-full ">
          <Grids rows={"8"} gap={"5"}>
            <Holds className="row-start-1 row-end-2 h-full w-full ">
              <TitleBoxes onClick={prevStep}>
                <Holds className="h-full justify-end items-end">
                  <Holds position={"row"} className="justify-center gap-2">
                    <Titles size={"h2"}>{t("EndWorkDay")}</Titles>
                    <Images
                      titleImg="/endDay.svg"
                      titleImgAlt="end work day"
                      className="max-w-8 h-auto"
                    />
                  </Holds>
                </Holds>
              </TitleBoxes>
            </Holds>

            <Holds className="row-start-2 row-end-3 h-full">
              <Contents width={"section"}>
                <Texts size={"p5"}>{t("SignatureAcknowledgement")}</Texts>
              </Contents>
            </Holds>

            <Holds className="row-start-3 row-end-5 h-full ">
              <Contents width={"section"}>
                <Holds className="border-[3px] border-black rounded-[10px] h-full">
                  {loading ? (
                    <Holds className="my-auto">
                      <Spinner />
                    </Holds>
                  ) : (
                    <Holds className="my-auto">
                      {base64String ? (
                        <Images
                          titleImg={base64String}
                          titleImgAlt={"Loading signature"}
                          className="w-[40%] mx-auto"
                        />
                      ) : (
                        <Holds className="my-auto">
                          <Texts size={"p2"}>{t("NoSignature")}</Texts>
                        </Holds>
                      )}
                    </Holds>
                  )}
                </Holds>
              </Contents>
            </Holds>
            <Holds className="row-start-5 row-end-6">
              <Contents width={"section"}>
                <Holds position={"row"}>
                  <Holds className="w-fit pr-6">
                    <CheckBox
                      id="injury-checkbox"
                      name="injury-verify"
                      onChange={handleCheckboxChange}
                      checked={checked}
                      size={2.5}
                    />
                  </Holds>
                  <Holds className="w-full">
                    <Texts size={"p3"} position={"left"}>
                      {t("ThisIsMySignature")}
                    </Texts>
                  </Holds>
                </Holds>
              </Contents>
            </Holds>

            <Holds className="row-start-8 row-end-9 h-full pb-5 ">
              <Contents width={"section"} className="h-full">
                <Buttons
                  background={checked ? "orange" : "red"}
                  onClick={handleNextStepAndSubmit}
                  disabled={loading}
                  className="w-full h-full "
                >
                  <Titles size={"h2"}>
                    {checked ? t("Continue") : t("ReportInjury")}
                  </Titles>
                </Buttons>
              </Contents>
            </Holds>
          </Grids>
        </Holds>
      </Contents>
    </Bases>
  );
};
