import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import QrHandler from "./qrHandler";
import { useEffect, useState } from "react";
import CodeStep from "./codeStep";
import { equipmentType } from "./companyDocuments";

type EqScannerModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scanned: string | null;
  setScanned: React.Dispatch<React.SetStateAction<string | null>>;
  equipment?: equipmentType[];
};

export default function EqScannerModal({
  setModalOpen,
  scanned,
  setScanned,
  equipment,
}: EqScannerModalProps) {
  const [step, setStep] = useState<number>(0);


// useEffect to reset step and role on mount/unmount
  useEffect(() => {
    setStep(0);
    return () => {
      setStep(0);
    };
  }, []);

  //------------------------------------------------------------------
  //------------------------------------------------------------------
  // Helper functions
  //------------------------------------------------------------------
  //------------------------------------------------------------------
  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);
  const handleCloseModal = () => {
    setModalOpen(false);
  };
if (step === 0) {
  return (
    <Holds background="white" className="h-full py-5">
    <Grids rows="7" gap="3">

      {/* Modal Content */}
      <Holds className="flex justify-center items-center h-full w-full row-start-1 row-end-8">
        <Contents width="section">
          <QrHandler
              handleReturnPath={() => {
                handleCloseModal();
              }}
              handleNextStep = {handleNextStep}
              scanned= {scanned}
              setScanned = {setScanned}
              equipment = {equipment || []}
              />
        </Contents>
      </Holds>
    </Grids>
  </Holds>
  );
} if (step === 1) {
  return (
        <Holds background={"white"} className="h-full w-full py-5">
          <Contents width="section">
            <CodeStep
              handleNextStep={handleCloseModal}
              handlePrevStep={handlePrevStep}
              setScanned={setScanned}
            />
          </Contents>
        </Holds>
  )
} else {
  return null;
}
}
