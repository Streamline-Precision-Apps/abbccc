import { Holds } from "@/components/(reusable)/holds";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export default function TruckTabOptions({
  activeTab,
  setActiveTab,
  isLoading,
  isComplete,
}: {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  isLoading: boolean;
  isComplete: {
    haulingLogsTab: boolean;
    notesTab: boolean;
    stateMileageTab: boolean;
    refuelLogsTab: boolean;
  };
}) {
  const t = useTranslations("TruckingAssistant");
  return (
    <Holds position={"row"} className=" h-fit w-full gap-1">
      <NewTab
        titleImage="/Hauling-logs.svg"
        titleImageAlt="Truck"
        onClick={() => setActiveTab(1)}
        isActive={activeTab === 1}
        isComplete={isComplete.haulingLogsTab}
        isLoading={isLoading}
      >
        <Titles size={"h4"}>{t("HaulingLogs")}</Titles>
      </NewTab>
      <NewTab
        titleImage="/comment.svg"
        titleImageAlt={t("WorkDetails")}
        onClick={() => setActiveTab(2)}
        isActive={activeTab === 2}
        isComplete={isComplete.notesTab}
        isLoading={isLoading}
      >
        <Titles size={"h4"}>{t("WorkDetails")}</Titles>
      </NewTab>
      <NewTab
        titleImage="/state-mileage.svg"
        titleImageAlt="State Mileage"
        onClick={() => setActiveTab(3)}
        isActive={activeTab === 3}
        isComplete={isComplete.stateMileageTab}
        isLoading={isLoading}
      >
        <Titles size={"h4"}>{t("StateMileage")}</Titles>
      </NewTab>
      <NewTab
        titleImage="/refuel-Icon.svg"
        titleImageAlt="Refuel"
        onClick={() => setActiveTab(4)}
        isActive={activeTab === 4}
        isComplete={isComplete.refuelLogsTab}
        isLoading={isLoading}
      >
        <Titles size={"h4"}>{t("RefuelLogs")}</Titles>
      </NewTab>
    </Holds>
  );
}
