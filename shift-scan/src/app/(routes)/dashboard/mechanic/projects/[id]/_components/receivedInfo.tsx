import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function ReceivedInfo({
  loading,
  problemReceived,
  additionalNotes,
  leaveProject,
  myComment,
  hasBeenDelayed,
}: {
  loading: boolean;
  problemReceived: string;
  additionalNotes: string;
  leaveProject: () => void;
  myComment: string;
  hasBeenDelayed: boolean;
}) {
  const t = useTranslations("MechanicWidget");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [buttonColor, setButtonColor] = useState(false);

  const [delayReasoning, setDelayReasoning] = useState<string>("");
  const [expectedArrival, setExpectedArrival] = useState("");

  useEffect(() => {
    // Case 1: No delay selected (empty/null) and comment > 3 chars
    console.log(
      "myComment: ",
      myComment,
      ", delayReasoning: ",
      delayReasoning,
      ", expected Arrival: ",
      expectedArrival
    );
    if (delayReasoning === "" && myComment.length > 3) {
      setExpectedArrival("");
      setIsButtonDisabled(false);
      setButtonColor(true);
    }
    // Case 2: Delay selected, must have date and comment > 3 chars
    else if (
      delayReasoning === "Delay" &&
      expectedArrival &&
      myComment.length > 3
    ) {
      setIsButtonDisabled(false);
      setButtonColor(true);
    }
    // All other cases
    else {
      setIsButtonDisabled(true);
      setButtonColor(false);
    }
  }, [myComment, delayReasoning, expectedArrival]);

  if (loading)
    return (
      <Holds className="h-full py-2 justify-center items-center">
        <Spinner />
      </Holds>
    );

  return (
    <Holds className="h-full py-2">
      <Contents width={"section"}>
        <Grids rows={"8"} gap={"5"} className="h-full">
          <Holds className="row-start-1 row-end-8 h-full flex flex-col">
            <Holds>
              <Labels size={"p4"} htmlFor="problemReceived">
                {t("ProblemReceived")}
              </Labels>
              <TextAreas
                disabled
                name="problemReceived"
                value={problemReceived}
                rows={2}
              />
            </Holds>
            <Holds>
              <Labels size={"p4"} htmlFor="additionalNotes">
                {t("AdditionalNotes")}
              </Labels>
              <TextAreas
                disabled
                name="additionalNotes"
                value={additionalNotes}
                rows={2}
              />
            </Holds>
            {hasBeenDelayed && (
              <Holds className=" py-1">
                <Texts position={"left"} size={"p7"} className="text-red-500">
                  {`* ${t("ProjectHasAlreadyBeenDelayed")} *`}
                </Texts>
              </Holds>
            )}
            <Holds>
              <Labels size={"p4"} htmlFor="delayReasoning">
                {t("DelayStatus")}
              </Labels>
              <Selects
                name="delayReasoning"
                value={delayReasoning}
                onChange={(e) => setDelayReasoning(e.target.value)}
              >
                <option value="">{t("NoDelay")}</option>
                <option value="Delay">{t("Delay")}</option>
              </Selects>
            </Holds>

            {delayReasoning === "Delay" && (
              <Holds>
                <Labels size={"p4"} htmlFor="delayDate">
                  {t("ExpectArrival")}
                </Labels>
                <Inputs
                  type="date"
                  name="delayDate"
                  defaultValue={expectedArrival || ""}
                  onChange={(e) => setExpectedArrival(e.target.value)}
                />
              </Holds>
            )}

            {myComment.length < 3 && (
              <Texts size="p6" className="text-red-500 px-5 pt-10 ">
                {`* ${t("RecordToLeaveProject")}`}
              </Texts>
            )}
          </Holds>
          <Holds className="row-start-8 row-end-9 h-full">
            <Buttons
              disabled={isButtonDisabled}
              background={buttonColor ? "red" : "darkGray"}
              className="h-full"
              onClick={leaveProject}
            >
              <Titles size={"h2"}>{t("LeaveProject")}</Titles>
            </Buttons>
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
