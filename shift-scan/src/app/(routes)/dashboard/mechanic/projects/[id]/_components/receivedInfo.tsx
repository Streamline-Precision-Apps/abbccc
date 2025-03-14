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

export default function ReceivedInfo({
  loading,
  problemReceived,
  additionalNotes,
  delayReasoning,
  expectedArrival,
  setDelayReasoning,
  setExpectedArrival,
  leaveProject,
  myComment,
  hasBeenDelayed,
}: {
  loading: boolean;
  problemReceived: string;
  additionalNotes: string;
  delayReasoning: string;
  expectedArrival: string;
  setDelayReasoning: React.Dispatch<React.SetStateAction<string>>;
  setExpectedArrival: React.Dispatch<React.SetStateAction<string>>;
  leaveProject: () => void;
  myComment: string;
  hasBeenDelayed: boolean;
}) {
  const t = useTranslations("MechanicWidget");
  const isButtonDisabled =
    (myComment.length > 3 && delayReasoning === "") ||
    (delayReasoning === "Delay" &&
      expectedArrival === "" &&
      myComment.length > 3);

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
                  value={expectedArrival}
                  onChange={(e) => setExpectedArrival(e.target.value)}
                />
                <span className="text-red-500">
                  {hasBeenDelayed ? t("ProjectHasAlreadyBeenDelayed") : ""}
                </span>
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
              disabled={!isButtonDisabled}
              background={isButtonDisabled ? "red" : "darkGray"}
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
