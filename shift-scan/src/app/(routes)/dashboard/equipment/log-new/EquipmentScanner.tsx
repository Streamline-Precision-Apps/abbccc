import { CreateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import Spinner from "@/components/(animations)/spinner";
import SimpleQr from "@/components/(clock)/simple-qr";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  use,
  useEffect,
  useState,
} from "react";
type Option = {
  label: string;
  code: string;
};

export default function EquipmentScanner({
  setStep,
  setMethod,
  setEquipmentQr,
  setError,
  equipmentQr,
  jobSite,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setMethod: Dispatch<SetStateAction<"" | "Scan" | "Select">>;
  setError: Dispatch<SetStateAction<string | null>>;
  setEquipmentQr: Dispatch<SetStateAction<string | null>>;
  equipmentQr: string | null;
  jobSite: Option;
}) {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const id = useSession().data?.user.id;
  const router = useRouter();

  // Handle the QR scan completion
  const handleScanComplete = async (scannedId: string) => {
    setEquipmentQr(scannedId);
    setScanned(true);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("equipmentId", scannedId);
      formData.append("jobsiteId", jobSite?.code || "");
      formData.append("startTime", new Date().toString());
      formData.append("employeeId", id || "");

      const result = await CreateEmployeeEquipmentLog(formData);
      if (result) {
        router.push("/dashboard/equipment");
      }
    } catch (error) {
      console.error("Error submitting equipment log:", error);
      setEquipmentQr(null);
      setError("Qr code does not exist. Please try again.");
      setStep(1);
      // Handle error state if needed
    } finally {
      setLoading(false);
    }
  };

  // Reset scanned state when equipmentQr changes
  useEffect(() => {
    if (equipmentQr) {
      setScanned(false);
    }
  }, [equipmentQr]);

  return (
    <Holds className="h-full pb-5">
      <Grids rows={"7"} gap={"5"}>
        <Holds className="row-start-1 row-end-2">
          <TitleBoxes
            onClick={() => {
              setStep(1);
              setMethod("");
            }}
          />
        </Holds>
        <Holds className="row-start-2 row-end-3 h-full">
          <Titles size={"h1"}>Select Equipment</Titles>
        </Holds>
        <Holds className="size-full row-start-3 row-end-7 px-4">
          {loading ? (
            <Holds className="flex justify-center items-center h-full w-full">
              <Spinner size={40} />
            </Holds>
          ) : (
            <SimpleQr
              setScannedId={setEquipmentQr}
              setScanned={setScanned}
              onScanComplete={handleScanComplete}
            />
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
