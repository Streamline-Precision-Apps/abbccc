"use client";
import CodeStep from "@/components/(clock)/code-step";
import QRStep from "@/components/(clock)/qr-handler";
import SimpleQr from "@/components/(clock)/simple-qr";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { set } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function CreateMechanicProjectProcess() {
  const [scannedId, setScannedId] = useState<string | null>(null);
  const t = useTranslations("Clock");
  const [step, setStep] = useState(1);
  const [scanned, setScanned] = useState(false);
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };
  useEffect(() => {
    if (scannedId) {
      setScanned(true);
      nextStep();
      nextStep();
    }
  }, [scannedId]);

  return (
    <>
      <Bases>
        <Contents>
          {/*Select Scanning Option */}
          {step === 1 && (
            <Holds background={"white"} className="w-full h-full py-4">
              <Grids rows={"7"} gap={"5"} className="w-full h-full ">
                <Holds className="row-start-1 row-end-2 h-full">
                  <TitleBoxes
                    title="Select Equipment"
                    titleImg="/mechanic.svg"
                    titleImgAlt={"Mechanic"}
                    type="noIcon"
                  />
                </Holds>
                <Holds className="row-start-3 row-end-5">
                  <Images titleImg="/camera.svg" titleImgAlt={""} size={"40"} />
                </Holds>
                <Holds className="row-start-6 row-end-7 h-full">
                  <Contents>
                    <Buttons background={"lightBlue"} onClick={nextStep}>
                      <Titles size={"h4"}>Scan Equipment</Titles>
                    </Buttons>
                  </Contents>
                </Holds>
                <Holds className="row-start-7 row-end-8 h-full">
                  <Contents>
                    <Buttons
                      background={"lightBlue"}
                      onClick={() => {
                        nextStep();
                        nextStep();
                      }}
                    >
                      <Titles size={"h4"}>Select Manually</Titles>
                    </Buttons>
                  </Contents>
                </Holds>
              </Grids>
            </Holds>
          )}
          {/*Qr Scan Equipment option */}
          {step === 2 && (
            <Holds>
              <Holds background={"white"} className="w-full h-full py-4">
                <Grids rows={"7"} gap={"5"} className="w-full h-full ">
                  <Holds>
                    <TitleBoxes
                      title="Select Equipment"
                      titleImg="/mechanic.svg"
                      titleImgAlt={"Mechanic"}
                      onClick={prevStep}
                      type="noIcon-NoHref"
                    />
                  </Holds>

                  <Holds className="row-start-2 row-end-5 h-full ">
                    <Contents>
                      <Holds className="h-full w-full row-start-2 row-end-6 justify-center border-[3px] p-3 border-black rounded-[10px] ">
                        <SimpleQr setScannedId={setScannedId} />
                      </Holds>
                    </Contents>
                  </Holds>
                  <Holds>
                    <Buttons background={"none"} onClick={() => setStep(3)}>
                      <Texts size={"p4"}>{t("TroubleScanning")}</Texts>
                    </Buttons>
                  </Holds>
                </Grids>
              </Holds>
            </Holds>
          )}

          {/*Manual Entry of Equipment */}
          {step === 3 && (
            <Holds background={"white"} className="w-full h-full py-4">
              <Contents>
                <CodeStep
                  datatype="equipment" // using this to set the title of equipment
                  handlePrevStep={prevStep}
                  handleNextStep={nextStep}
                  handleScannedPrevStep={() => setStep(1)}
                  scanned={scanned}
                  setScannedId={setScannedId}
                />
              </Contents>
            </Holds>
          )}

          {/*Creation of Project with problem, jobsite, status*/}
          {step === 4 && (
            <Holds>{scanned && <Texts size={"p3"}>{scannedId}</Texts>}</Holds>
          )}
        </Contents>
      </Bases>
    </>
  );
}
