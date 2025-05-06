import Spinner from "@/components/(animations)/spinner";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
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
        <Holds background={"white"} className="h-full py-4">
          <Contents width={"section"}>
            <Grids rows={"8"} gap={"5"}>
              <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
                <Grids
                  rows={"2"}
                  cols={"5"}
                  gap={"3"}
                  className=" h-full w-full"
                >
                  <Holds className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center">
                    <Images
                      titleImg="/arrowBack.svg"
                      titleImgAlt="back"
                      position={"left"}
                      onClick={prevStep}
                    />
                  </Holds>

                  <Holds
                    position={"row"}
                    className="row-start-2 row-end-3 col-start-1 col-end-6 h-full w-full justify-center gap-4"
                  >
                    <Titles size={"h2"}>{t("InjuryVerification")}</Titles>
                    <Images
                      titleImg="/endDay.svg"
                      titleImgAlt="logo"
                      className="w-10 h-10"
                    />
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="row-start-3 row-end-4">
                <Texts size={"p3"}>{t("SignBelow")}</Texts>
              </Holds>
              <Holds position={"row"} className="row-start-5 row-end-6">
                <Holds size={"70"}>
                  <Titles size={"h3"} position={"left"}>
                    {t("SignatureVerify")}
                  </Titles>
                </Holds>
                <Holds size={"30"}>
                  <CheckBox
                    id="injury-checkbox"
                    name="injury-verify"
                    onChange={handleCheckboxChange}
                    checked={checked}
                    size={3}
                  />
                </Holds>
              </Holds>
              <Holds className="row-start-6 row-end-8 h-full ">
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
              </Holds>

              <Holds className="row-start-8 row-end-9 h-full ">
                <Buttons
                  background={checked ? "green" : "red"}
                  onClick={handleNextStepAndSubmit}
                  disabled={loading}
                >
                  <Titles size={"h3"}>
                    {checked ? t("Continue") : t("ReportInjury")}
                  </Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
      </Contents>
    </Bases>
  );
};
