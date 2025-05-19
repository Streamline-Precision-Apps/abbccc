import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, use, useEffect } from "react";

export default function SelectEquipment({
  setStep,
  setMethod,
  error,
  setError,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setMethod: Dispatch<SetStateAction<"Scan" | "Select" | "">>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error]);

  return (
    <Holds className="h-full pb-5">
      <Grids rows={"7"} gap={"5"}>
        <Holds className="row-start-1 row-end-2">
          <TitleBoxes
            onClick={() => router.push("/dashboard/equipment")}
          ></TitleBoxes>
        </Holds>
        <Holds className="row-start-2 row-end-3 h-full">
          <Titles size={"h1"}>Select Equipment</Titles>
          {error && (
            <Holds className="h-full pt-2 justify-center">
              <Texts className="text-app-red " size={"p6"}>
                {error}
              </Texts>
            </Holds>
          )}
        </Holds>
        <Holds className="row-start-3 row-end-6">
          <Images
            titleImg="/camera.svg"
            titleImgAlt="clockIn"
            position={"center"}
            size={"40"}
          />
        </Holds>
        <Holds className="row-start-6 row-end-8">
          <Contents width={"section"}>
            <Holds className="pb-5">
              <Buttons
                className="py-4"
                onClick={() => {
                  setStep(2);
                  setMethod("Scan");
                }}
              >
                <Titles size={"h3"}>Scan Equipment</Titles>
              </Buttons>
            </Holds>
            <Holds>
              <Buttons
                className="py-4"
                onClick={() => {
                  setStep(2);
                  setMethod("Select");
                }}
              >
                <Titles size={"h3"}>Select Manually</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
